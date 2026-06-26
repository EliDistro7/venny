"use client";

import React, {
  useEffect, useState, useCallback, useMemo, useRef,
} from "react";
import { getAuthToken } from "@/lib/adminApi";
import {
  Shield, Users, TrendingUp,
  Search, MapPin, ChevronRight,
  Check, AlertCircle, Code2, Pencil,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CONTENT_KEYS: { key: string; label: string; hint: string }[] = [
  { key: "hero",      label: "Hero",      hint: "Click any text in the preview to edit it directly. Use the JSON panel for image URLs." },
  { key: "stats",     label: "Stats",     hint: "Click numbers or labels to edit. Use + Add stat to add new items, hover a stat to delete it." },
  { key: "featured",  label: "Featured",  hint: "Click eyebrow, heading, or link label to edit." },
  { key: "locations", label: "Locations", hint: "Click eyebrow or heading to edit." },
  { key: "whyus",     label: "Why Us",    hint: "Click any card text to edit. Hover a card to delete it. Use + Add card to add new ones. Change icons via JSON." },
  { key: "cta",       label: "CTA",       hint: "Click any text to edit. Use JSON to change the background image or button link." },
];

interface BlockState {
  raw: string;
  saved: string;
  saving: boolean;
  error: string | null;
  success: boolean;
}

// ─── Brand tokens ────────────────────────────────────────────────────────────
const B = {
  charcoal:   "#1C1C1E",
  charcoalMid:"#2C2C2E",
  red:        "#A02B2F",
  redDark:    "#7E2125",
  gold:       "#F2C94C",
  cream:      "#F8F5F0",
  creamMid:   "rgba(248,245,240,0.75)",
  creamFaint: "rgba(248,245,240,0.05)",
  goldBorder: "rgba(242,201,76,0.15)",
  redMid:     "rgba(160,43,47,0.2)",
};

// ─── Path helpers ─────────────────────────────────────────────────────────────
function setPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clone: any = structuredClone(obj);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const nextKey = keys[i + 1];
    const nextIsIndex = /^\d+$/.test(nextKey);
    if (Array.isArray(cur)) {
      const idx = Number(k);
      if (cur[idx] == null) cur[idx] = nextIsIndex ? [] : {};
      cur = cur[idx];
    } else {
      if (cur[k] == null) cur[k] = nextIsIndex ? [] : {};
      cur = cur[k];
    }
  }
  const lastKey = keys[keys.length - 1];
  if (Array.isArray(cur)) {
    cur[Number(lastKey)] = value;
  } else {
    cur[lastKey] = value;
  }
  return clone;
}

// ─── EditableText ─────────────────────────────────────────────────────────────
type HtmlTag = keyof React.JSX.IntrinsicElements;

interface ETProps {
  value: string;
  onCommit: (v: string) => void;
  style?: React.CSSProperties;
  className?: string;
  tag?: HtmlTag;
  multiline?: boolean;
  placeholder?: string;
}

function ET({
  value, onCommit, style, className = "", tag: Tag = "span",
  multiline = false, placeholder = "Click to edit",
}: ETProps) {
  const ref = useRef<HTMLElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || focused) return;
    if (el.innerText !== value) el.innerText = value;
  }, [value, focused]);

  function handleFocus() { setFocused(true); }

  function handleBlur() {
    setFocused(false);
    const newVal = ref.current?.innerText ?? "";
    if (newVal !== value) onCommit(newVal);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === "Escape") {
      if (ref.current) ref.current.innerText = value;
      (e.target as HTMLElement).blur();
    }
  }

  const editableStyle: React.CSSProperties = {
    ...style,
    outline: "none",
    cursor: "text",
    borderBottom: focused
      ? `1.5px solid ${B.gold}`
      : "1.5px solid transparent",
    transition: "border-color 0.15s",
    paddingBottom: 1,
    position: "relative",
  };

  return (
    <span className="group/et relative inline" style={{ position: "relative" }}>
      {!focused && (
        <span
          className="absolute -top-3 -right-3 z-50 opacity-0 group-hover/et:opacity-100 transition-opacity pointer-events-none"
          style={{
            backgroundColor: B.gold,
            borderRadius: 4,
            padding: "1px 3px",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <Pencil size={8} color={B.charcoal} />
        </span>
      )}
      {React.createElement(
        Tag as string,
        {
          ref,
          contentEditable: true,
          suppressContentEditableWarning: true,
          onFocus: handleFocus,
          onBlur: handleBlur,
          onKeyDown: handleKeyDown,
          "data-placeholder": placeholder,
          className: `${className} focus:outline-none`,
          style: editableStyle,
        },
        value,
      )}
    </span>
  );
}

// ─── Add button shared style ──────────────────────────────────────────────────
function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full py-2 rounded text-xs font-bold transition-all"
      style={{
        border: `1px dashed ${hovered ? "rgba(242,201,76,0.7)" : "rgba(242,201,76,0.3)"}`,
        color: hovered ? "rgba(242,201,76,0.9)" : "rgba(242,201,76,0.5)",
        fontFamily: "sans-serif",
        letterSpacing: "0.08em",
        backgroundColor: "transparent",
      }}
    >
      {label}
    </button>
  );
}

// ─── Preview components ───────────────────────────────────────────────────────
interface PreviewProps {
  data: Record<string, unknown>;
  onField: (path: string, value: string) => void;
  onArray: (path: string, value: unknown[]) => void;
}

function HeroPreview({ data: d, onField }: PreviewProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{ backgroundColor: B.charcoal, minHeight: 440, fontFamily: "Georgia, serif" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg,rgba(28,28,30,0.93) 0%,rgba(28,28,30,0.62) 60%,rgba(0,0,0,0.48) 100%)" }}
      />
      {(() => {
        const bg = d.backgroundImage as string | undefined;
        return bg?.startsWith("http") ? (
          <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        ) : null;
      })()}

      <div className="absolute top-6 right-6 text-right select-none z-10">
        <div className="text-4xl font-bold leading-none" style={{ color: "rgba(160,43,47,0.38)" }}>
          <ET value={String(d.decorativeWord1 ?? "Nyumba")} onCommit={(v) => onField("decorativeWord1", v)} style={{ color: "inherit", fontFamily: "Georgia, serif", fontSize: "inherit" }} />
        </div>
        <div className="text-xl font-light mt-0.5" style={{ color: "rgba(160,43,47,0.22)" }}>
          <ET value={String(d.decorativeWord2 ?? "Bora")} onCommit={(v) => onField("decorativeWord2", v)} style={{ color: "inherit", fontFamily: "Georgia, serif", fontSize: "inherit" }} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-8 py-12">
        <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: B.gold, letterSpacing: "0.15em", fontFamily: "sans-serif" }}>
          <ET value={String(d.eyebrow ?? "Venny Construction & Real Estate")} onCommit={(v) => onField("eyebrow", v)} style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} />
        </div>

        <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: B.cream }}>
          <ET value={String(d.headingLine1 ?? "Maisha Ni")} onCommit={(v) => onField("headingLine1", v)} style={{ color: B.cream }} />
          <br />
          <ET value={String(d.headingAccent ?? "Nyumba Bora")} onCommit={(v) => onField("headingAccent", v)} style={{ color: B.gold }} />
          <br />
          <ET value={String(d.headingLine3 ?? "in Tanzania")} onCommit={(v) => onField("headingLine3", v)} style={{ color: B.cream }} />
        </h1>

        <div className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: B.creamMid, fontFamily: "sans-serif" }}>
          <ET
            value={String(d.subheading ?? "Discover exceptional properties built and trusted by Venny Construction.")}
            onCommit={(v) => onField("subheading", v)}
            multiline
            style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", lineHeight: "inherit" }}
          />
        </div>

        <div className="flex rounded-lg overflow-hidden max-w-sm w-full mb-4" style={{ backgroundColor: "rgba(255,255,255,0.95)", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
          <div className="flex items-center gap-2 flex-1 px-4 py-3">
            <MapPin size={14} style={{ color: B.red, flexShrink: 0 }} />
            <span className="text-xs" style={{ color: "#999", fontFamily: "sans-serif" }}>
              <ET value={String(d.searchPlaceholder ?? "Search by city or neighbourhood...")} onCommit={(v) => onField("searchPlaceholder", v)} style={{ color: "#999", fontFamily: "sans-serif", fontSize: "inherit" }} />
            </span>
          </div>
          <div className="flex items-center gap-1 px-5 py-3" style={{ background: `linear-gradient(135deg,${B.red},${B.redDark})` }}>
            <Search size={12} style={{ color: B.cream }} />
            <span className="text-xs font-bold" style={{ color: B.cream, fontFamily: "sans-serif" }}>Search</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 mt-2">
          <div className="w-px h-8 animate-pulse" style={{ backgroundColor: "rgba(242,201,76,0.4)" }} />
          <div className="text-[10px] tracking-widest" style={{ color: "rgba(242,201,76,0.6)", fontFamily: "sans-serif" }}>
            <ET value={String(d.scrollLabel ?? "SCROLL")} onCommit={(v) => onField("scrollLabel", v)} style={{ color: "inherit", fontFamily: "sans-serif", letterSpacing: "inherit", fontSize: "inherit" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsPreview({ data: d, onField, onArray }: PreviewProps) {
  const items = (d.items as Array<{ num: string; label: string } | null>) ?? [
    { num: "1,200+", label: "Properties Listed" },
    { num: "850+",   label: "Happy Clients" },
  ];

  function addItem() {
    onArray("items", [...items, { num: "0", label: "New Stat" }]);
  }

  function removeItem(i: number) {
    onArray("items", items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="rounded-lg py-8 px-6" style={{ backgroundColor: B.charcoal }}>
      <div
        className="grid gap-6 text-center"
        style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)` }}
      >
        {items.map((s, i) => {
          if (!s) return null;
          return (
            <div key={i} className="relative group/stat">
              <button
                onClick={() => removeItem(i)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/stat:opacity-100 transition-opacity z-10 text-xs leading-none"
                style={{ backgroundColor: B.red, color: B.cream }}
                title="Remove stat"
              >
                ×
              </button>
              <div className="text-2xl font-bold mb-1" style={{ color: B.gold, fontFamily: "Georgia, serif" }}>
                <ET
                  value={s.num ?? ""}
                  onCommit={(v) => onField(`items.${i}.num`, v)}
                  style={{ color: "inherit", fontFamily: "Georgia, serif", fontSize: "inherit", fontWeight: "inherit" }}
                />
              </div>
              <div className="text-xs" style={{ color: "rgba(248,245,240,0.6)", fontFamily: "sans-serif" }}>
                <ET
                  value={s.label ?? ""}
                  onCommit={(v) => onField(`items.${i}.label`, v)}
                  style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <AddButton onClick={addItem} label="+ Add stat" />
      </div>
    </div>
  );
}

function FeaturedPreview({ data: d, onField }: PreviewProps) {
  const placeholders = ["Msasani Villa", "Zanzibar Sea View", "Kariakoo Apartment"];

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: B.cream }}>
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: B.red, letterSpacing: "0.12em", fontFamily: "sans-serif" }}>
            <ET value={String(d.eyebrow ?? "Handpicked for You")} onCommit={(v) => onField("eyebrow", v)} style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} />
          </div>
          <div className="text-2xl font-bold" style={{ color: B.charcoal, fontFamily: "Georgia, serif" }}>
            <ET value={String(d.heading ?? "Featured Properties")} onCommit={(v) => onField("heading", v)} style={{ color: "inherit", fontFamily: "Georgia, serif", fontSize: "inherit", fontWeight: "inherit" }} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold" style={{ color: B.red, fontFamily: "sans-serif" }}>
          <ET value={String(d.viewAllLabel ?? "View All Properties")} onCommit={(v) => onField("viewAllLabel", v)} style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", fontWeight: "inherit" }} />
          <ChevronRight size={13} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {placeholders.map((name) => (
          <div key={name} className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="h-24" style={{ backgroundColor: "#D9D0C7" }} />
            <div className="p-3">
              <p className="text-xs font-bold mb-0.5" style={{ color: B.charcoal, fontFamily: "Georgia, serif" }}>{name}</p>
              <p className="text-[10px]" style={{ color: B.red, fontFamily: "sans-serif" }}>TZS 450M</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationsPreview({ data: d, onField }: PreviewProps) {
  const spots = ["Dar es Salaam", "Zanzibar", "Arusha", "Mwanza", "Dodoma"];

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: B.charcoal }}>
      <div className="text-center mb-5">
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: B.gold, letterSpacing: "0.12em", fontFamily: "sans-serif" }}>
          <ET value={String(d.eyebrow ?? "Explore Tanzania")} onCommit={(v) => onField("eyebrow", v)} style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} />
        </div>
        <div className="text-2xl font-bold" style={{ color: B.cream, fontFamily: "Georgia, serif" }}>
          <ET value={String(d.heading ?? "Properties by Destination")} onCommit={(v) => onField("heading", v)} style={{ color: "inherit", fontFamily: "Georgia, serif", fontSize: "inherit", fontWeight: "inherit" }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {spots.slice(0, 5).map((city, i) => (
          <div
            key={city}
            className="relative rounded-lg overflow-hidden flex items-end p-3"
            style={{ height: i === 0 ? 120 : 72, gridColumn: i === 0 ? "span 2" : "span 1", backgroundColor: B.charcoalMid }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(28,28,30,0.8) 0%,transparent 60%)" }} />
            <div className="relative z-10">
              <p className="text-xs font-bold" style={{ color: B.cream, fontFamily: "Georgia, serif" }}>{city}</p>
              <p className="text-[10px]" style={{ color: B.gold, fontFamily: "sans-serif" }}>12 properties</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ICON_MAP: Record<string, React.ElementType> = { Shield, Users, TrendingUp };

function WhyUsPreview({ data: d, onField, onArray }: PreviewProps) {
  const cards = (d.cards as Array<{ icon?: string; title?: string; desc?: string } | null>) ?? [
    { icon: "Shield",     title: "Verified Listings",   desc: "Every property is physically inspected and legally verified." },
    { icon: "Users",      title: "Expert Local Agents", desc: "Our bilingual agents understand Tanzania's property market." },
    { icon: "TrendingUp", title: "Market Intelligence", desc: "Access real price data and neighbourhood insights." },
  ];

  function addCard() {
    onArray("cards", [...cards, { icon: "Shield", title: "New Feature", desc: "Describe it here." }]);
  }

  function removeCard(i: number) {
    onArray("cards", cards.filter((_, idx) => idx !== i));
  }

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: B.charcoal }}>
      <div className="text-center mb-5">
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: B.gold, letterSpacing: "0.12em", fontFamily: "sans-serif" }}>
          <ET value={String(d.eyebrow ?? "Why Venny Construction")} onCommit={(v) => onField("eyebrow", v)} style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} />
        </div>
        <div className="text-xl font-bold whitespace-pre-line" style={{ color: B.cream, fontFamily: "Georgia, serif" }}>
          <ET
            value={String(d.heading ?? "The Trusted Way to\nBuy & Sell in Tanzania")}
            onCommit={(v) => onField("heading", v)}
            multiline
            style={{ color: "inherit", fontFamily: "Georgia, serif", fontSize: "inherit", fontWeight: "inherit" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {cards.map((card, i) => {
          if (!card) return null;
          const Icon = ICON_MAP[card.icon ?? "Shield"] ?? Shield;
          return (
            <div
              key={i}
              className="relative group/card rounded-lg p-4"
              style={{ backgroundColor: B.creamFaint, border: `1px solid ${B.goldBorder}` }}
            >
              <button
                onClick={() => removeCard(i)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity z-10 text-xs leading-none"
                style={{ backgroundColor: B.red, color: B.cream }}
                title="Remove card"
              >
                ×
              </button>
              <div className="w-8 h-8 rounded-md flex items-center justify-center mb-3" style={{ backgroundColor: B.redMid }}>
                <Icon size={16} style={{ color: B.gold }} />
              </div>
              <div className="text-sm font-bold mb-1.5" style={{ color: B.cream, fontFamily: "Georgia, serif" }}>
                <ET value={card.title ?? "Feature"} onCommit={(v) => onField(`cards.${i}.title`, v)} style={{ color: "inherit", fontFamily: "Georgia, serif", fontSize: "inherit", fontWeight: "inherit" }} />
              </div>
              <div className="text-[11px] leading-relaxed" style={{ color: "rgba(248,245,240,0.55)", fontFamily: "sans-serif" }}>
                <ET value={card.desc ?? ""} onCommit={(v) => onField(`cards.${i}.desc`, v)} multiline style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", lineHeight: "inherit" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <AddButton onClick={addCard} label="+ Add card" />
      </div>

      <p className="text-center mt-3 text-[10px]" style={{ color: "rgba(248,245,240,0.2)", fontFamily: "sans-serif" }}>
        Change icons (Shield / Users / TrendingUp) via the JSON panel →
      </p>
    </div>
  );
}

function CtaPreview({ data: d, onField }: PreviewProps) {
  const bg = d.backgroundImage as string | undefined;

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: B.charcoal, minHeight: 280 }}>
      {bg?.startsWith("http") && (
        <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      )}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg,rgba(28,28,30,0.94) 0%,rgba(160,43,47,0.7) 100%)` }} />
      <div className="relative z-10 flex flex-col items-center text-center px-8 py-10">
        <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: B.gold, letterSpacing: "0.12em", fontFamily: "sans-serif" }}>
          <ET value={String(d.eyebrow ?? "Own Property in Tanzania?")} onCommit={(v) => onField("eyebrow", v)} style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} />
        </div>
        <div className="text-2xl font-bold mb-3 whitespace-pre-line" style={{ color: B.cream, fontFamily: "Georgia, serif" }}>
          <ET value={String(d.heading ?? "List With Venny\n& Reach Thousands")} onCommit={(v) => onField("heading", v)} multiline style={{ color: "inherit", fontFamily: "Georgia, serif", fontSize: "inherit", fontWeight: "inherit" }} />
        </div>
        <div className="text-sm mb-6 max-w-sm" style={{ color: "rgba(248,245,240,0.7)", fontFamily: "sans-serif" }}>
          <ET value={String(d.subheading ?? "Connect with verified buyers and renters across Tanzania.")} onCommit={(v) => onField("subheading", v)} multiline style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", lineHeight: "inherit" }} />
        </div>
        <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded text-sm font-bold" style={{ background: `linear-gradient(135deg,${B.red},${B.redDark})`, color: B.cream, fontFamily: "sans-serif" }}>
          <ET value={String(d.buttonLabel ?? "List Your Property Free")} onCommit={(v) => onField("buttonLabel", v)} style={{ color: "inherit", fontFamily: "sans-serif", fontSize: "inherit", fontWeight: "inherit" }} />
          <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}

const PREVIEWS: Record<string, React.ComponentType<PreviewProps>> = {
  hero: HeroPreview,
  stats: StatsPreview,
  featured: FeaturedPreview,
  locations: LocationsPreview,
  whyus: WhyUsPreview,
  cta: CtaPreview,
};

// ─── Schema hint (JSON-only fields) ──────────────────────────────────────────
const JSON_ONLY_FIELDS: Record<string, Array<{ field: string; type: string; note: string }>> = {
  hero:  [{ field: "backgroundImage", type: "string (URL or /path)", note: "Full-bleed background photo" }],
  whyus: [{ field: "cards[*].icon", type: "Shield | Users | TrendingUp", note: "Icon name per card" }],
  cta:   [
    { field: "backgroundImage", type: "string (URL)", note: "Background photo" },
    { field: "buttonHref",      type: "string (path)", note: "Button destination URL" },
  ],
};

function JsonOnlyHint({ sectionKey }: { sectionKey: string }) {
  const fields = JSON_ONLY_FIELDS[sectionKey];
  if (!fields?.length) return null;
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ backgroundColor: "#DDD9D5" }}>
        <Code2 size={11} color="#7A7570" />
        <p className="text-[10px] font-body uppercase" style={{ color: "#7A7570", letterSpacing: "0.12em" }}>
          JSON-only fields (can&apos;t be edited inline)
        </p>
      </div>
      <div style={{ backgroundColor: "#E8E4E0" }}>
        {fields.map(({ field, type, note }, i) => (
          <div key={field} className="flex gap-4 px-4 py-2.5" style={{ borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.06)" }}>
            <code className="text-xs shrink-0" style={{ color: B.red, fontFamily: "monospace", minWidth: 160 }}>{field}</code>
            <span className="text-[11px] shrink-0" style={{ color: "#9A9590", fontFamily: "monospace", minWidth: 120 }}>{type}</span>
            <span className="text-[11px]" style={{ color: "#6A6560", fontFamily: "sans-serif" }}>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ContentEditorPage() {
  const [blocks, setBlocks]       = useState<Record<string, BlockState>>({});
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState(CONTENT_KEYS[0].key);
  const [showJson, setShowJson]   = useState(false);

  // Load
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/content`);
        const map: Record<string, unknown> = res.ok ? await res.json() : {};
        const initial: Record<string, BlockState> = {};
        CONTENT_KEYS.forEach(({ key }) => {
          const pretty = JSON.stringify(map[key] ?? {}, null, 2);
          initial[key] = { raw: pretty, saved: pretty, saving: false, error: null, success: false };
        });
        setBlocks(initial);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Write a dot-path string value back into the raw JSON
  const commitField = useCallback((blockKey: string, path: string, value: string) => {
    setBlocks((prev) => {
      const block = prev[blockKey];
      if (!block) return prev;
      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(block.raw); } catch { return prev; }
      const updated = setPath(parsed, path, value);
      const pretty  = JSON.stringify(updated, null, 2);
      return { ...prev, [blockKey]: { ...block, raw: pretty, error: null, success: false } };
    });
  }, []);

  // Replace an entire array at a dot-path
  const commitArray = useCallback((blockKey: string, path: string, value: unknown[]) => {
    setBlocks((prev) => {
      const block = prev[blockKey];
      if (!block) return prev;
      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(block.raw); } catch { return prev; }
      const updated = setPath(parsed, path, value);
      const pretty  = JSON.stringify(updated, null, 2);
      return { ...prev, [blockKey]: { ...block, raw: pretty, error: null, success: false } };
    });
  }, []);

  // Manual JSON textarea update
  const updateRaw = useCallback((key: string, raw: string) => {
    setBlocks((prev) => ({ ...prev, [key]: { ...prev[key], raw, error: null, success: false } }));
  }, []);

  // Save
  const save = useCallback(async (key: string) => {
    setBlocks((prev) => ({ ...prev, [key]: { ...prev[key], saving: true, error: null, success: false } }));
    try {
      const data  = JSON.parse(blocks[key].raw);
      const token = getAuthToken();
      const res   = await fetch(`${API_URL}/api/content/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || `HTTP ${res.status}`);
      }
      const pretty = JSON.stringify(data, null, 2);
      setBlocks((prev) => ({
        ...prev,
        [key]: { ...prev[key], saved: pretty, raw: pretty, saving: false, success: true },
      }));
      setTimeout(() => setBlocks((prev) => ({ ...prev, [key]: { ...prev[key], success: false } })), 2500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save failed";
      setBlocks((prev) => ({ ...prev, [key]: { ...prev[key], saving: false, error: message } }));
    }
  }, [blocks]);

  const reset = useCallback((key: string) => {
    setBlocks((prev) => ({ ...prev, [key]: { ...prev[key], raw: prev[key].saved, error: null, success: false } }));
  }, []);

  const parsedData = useMemo(() => {
    const out: Record<string, Record<string, unknown>> = {};
    Object.entries(blocks).forEach(([key, b]) => {
      try { out[key] = JSON.parse(b.raw); } catch { out[key] = {}; }
    });
    return out;
  }, [blocks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-brick-red border-t-transparent animate-spin" />
      </div>
    );
  }

  const activeBlock      = blocks[activeTab];
  const activeData       = parsedData[activeTab] ?? {};
  const PreviewComponent = PREVIEWS[activeTab];
  const isDirty          = activeBlock?.raw !== activeBlock?.saved;

  let jsonValid = true;
  try { JSON.parse(activeBlock?.raw ?? "{}"); } catch { jsonValid = false; }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#E8E4E0" }}>

      {/* ── Top bar ── */}
      <div style={{ backgroundColor: B.charcoal }} className="shrink-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
          <div>
            <p className="font-body text-[10px] uppercase mb-0.5" style={{ color: "rgba(248,245,240,0.35)", letterSpacing: "0.15em" }}>
              Admin · Site Content
            </p>
            <h1 className="font-display text-2xl text-white">Content Editor</h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: "rgba(242,201,76,0.08)", border: "1px solid rgba(242,201,76,0.15)" }}>
            <Pencil size={11} style={{ color: B.gold }} />
            <span className="text-[11px] font-body" style={{ color: "rgba(242,201,76,0.7)", letterSpacing: "0.06em" }}>
              Click any text in the preview to edit
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6" style={{ borderTop: "1px solid rgba(248,245,240,0.07)" }}>
          <div className="flex gap-0 overflow-x-auto">
            {CONTENT_KEYS.map(({ key, label }) => {
              const b      = blocks[key];
              const dirty  = b?.raw !== b?.saved;
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="relative flex items-center gap-2 px-5 py-3.5 text-sm font-body transition-colors whitespace-nowrap"
                  style={{
                    color: active ? B.cream : "rgba(248,245,240,0.4)",
                    borderBottom: active ? `2px solid ${B.gold}` : "2px solid transparent",
                    letterSpacing: "0.06em",
                  }}
                >
                  {label}
                  {dirty && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: B.gold }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col max-w-screen-xl w-full mx-auto">

        {/* ── Hint bar ── */}
        <div
          className="px-6 py-2.5 flex items-center justify-between gap-4 shrink-0"
          style={{ backgroundColor: "#DDD9D5", borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          <p className="text-[11px] font-body" style={{ color: "#7A7570", letterSpacing: "0.04em" }}>
            {CONTENT_KEYS.find((k) => k.key === activeTab)?.hint}
          </p>
          <button
            onClick={() => setShowJson((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] font-body transition-colors"
            style={{ color: showJson ? B.red : "#7A7570", letterSpacing: "0.06em" }}
          >
            <Code2 size={12} />
            {showJson ? "Hide JSON" : "Edit JSON"}
          </button>
        </div>

        {/* ── Preview + JSON split ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Preview column */}
          <div
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-4"
            style={{ borderRight: showJson ? "1px solid rgba(0,0,0,0.1)" : "none" }}
          >
            {PreviewComponent ? (
              <PreviewComponent
                data={activeData}
                onField={(path, value) => commitField(activeTab, path, value)}
                onArray={(path, value) => commitArray(activeTab, path, value)}
              />
            ) : (
              <div className="rounded-lg p-8 text-center" style={{ backgroundColor: B.charcoalMid }}>
                <p className="text-sm" style={{ color: "rgba(248,245,240,0.4)" }}>No preview available.</p>
              </div>
            )}

            <JsonOnlyHint sectionKey={activeTab} />
          </div>

          {/* JSON panel */}
          {showJson && (
            <div className="flex flex-col shrink-0" style={{ width: 420 }}>
              <div className="relative flex-1">
                {!jsonValid && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded text-[10px]" style={{ backgroundColor: "#3A1A1A", color: "#F87171" }}>
                    <AlertCircle size={10} /> Invalid JSON
                  </div>
                )}
                <textarea
                  value={activeBlock?.raw ?? ""}
                  onChange={(e) => updateRaw(activeTab, e.target.value)}
                  spellCheck={false}
                  className="w-full h-full font-mono text-xs p-5 outline-none resize-none"
                  style={{
                    backgroundColor: "#141416",
                    color: "rgba(248,245,240,0.85)",
                    lineHeight: "1.65",
                    caretColor: B.gold,
                    border: "none",
                    minHeight: 360,
                  }}
                />
              </div>

              <div
                className="px-4 py-3 flex items-center gap-3 shrink-0"
                style={{ backgroundColor: "#0E0E10", borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <button
                  onClick={() => save(activeTab)}
                  disabled={activeBlock?.saving || !jsonValid || !isDirty}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-body font-bold rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isDirty && jsonValid ? B.red : "rgba(248,245,240,0.08)",
                    color: B.cream,
                    letterSpacing: "0.08em",
                  }}
                >
                  {activeBlock?.saving ? (
                    <><span className="w-3 h-3 rounded-full border border-white/40 border-t-white animate-spin" />Saving…</>
                  ) : activeBlock?.success ? (
                    <><Check size={12} style={{ color: "#34D399" }} /><span style={{ color: "#34D399" }}>Saved</span></>
                  ) : "Publish"}
                </button>

                {isDirty && !activeBlock?.saving && (
                  <button onClick={() => reset(activeTab)} className="text-xs font-body" style={{ color: "rgba(248,245,240,0.3)", letterSpacing: "0.08em" }}>
                    Discard
                  </button>
                )}

                {activeBlock?.error && (
                  <span className="flex items-center gap-1 text-xs text-red-400 ml-auto">
                    <AlertCircle size={11} />{activeBlock.error}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Floating publish bar (JSON panel hidden) ── */}
        {!showJson && (
          <div
            className="shrink-0 px-6 py-3 flex items-center gap-4"
            style={{ backgroundColor: B.charcoal, borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              onClick={() => save(activeTab)}
              disabled={activeBlock?.saving || !isDirty}
              className="flex items-center gap-2 px-5 py-2 text-xs font-body font-bold rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isDirty ? B.red : "rgba(248,245,240,0.1)",
                color: B.cream,
                letterSpacing: "0.08em",
              }}
            >
              {activeBlock?.saving ? (
                <><span className="w-3 h-3 rounded-full border border-white/40 border-t-white animate-spin" />Saving…</>
              ) : activeBlock?.success ? (
                <><Check size={13} style={{ color: "#34D399" }} /><span style={{ color: "#34D399" }}>Published!</span></>
              ) : "Publish changes"}
            </button>

            {isDirty && !activeBlock?.saving && (
              <button onClick={() => reset(activeTab)} className="text-xs font-body" style={{ color: "rgba(248,245,240,0.35)", letterSpacing: "0.08em" }}>
                Discard
              </button>
            )}

            {activeBlock?.error && (
              <span className="flex items-center gap-1 text-xs text-red-400 ml-auto font-body">
                <AlertCircle size={12} />{activeBlock.error}
              </span>
            )}

            {!isDirty && !activeBlock?.error && (
              <span className="text-[11px] font-body ml-auto" style={{ color: "rgba(248,245,240,0.2)", letterSpacing: "0.06em" }}>
                All changes saved
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}