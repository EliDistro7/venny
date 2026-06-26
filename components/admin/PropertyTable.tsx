"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminProperty, PropertyType, PropertyCategory, PropertyStatus } from "@/types/admin";
import { deleteProperty } from "@/lib/adminApi";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Search, X } from "lucide-react";

interface PropertyTableProps {
  properties: AdminProperty[];
  onDeleted: (id: string) => void;
}

// ── Filter config ─────────────────────────────────────────────────────────────

type AvailabilityFilter = NonNullable<AdminProperty["availability"]> | "all";
type TypeFilter         = PropertyType | "all";
type CategoryFilter     = PropertyCategory | "all";
type StatusFilter       = PropertyStatus | "all";
type FeaturedFilter     = "all" | "featured" | "standard";

interface Filters {
  search:       string;
  type:         TypeFilter;
  category:     CategoryFilter;
  status:       StatusFilter;
  availability: AvailabilityFilter;
  featured:     FeaturedFilter;
}

const DEFAULTS: Filters = {
  search:       "",
  type:         "all",
  category:     "all",
  status:       "all",
  availability: "all",
  featured:     "all",
};

// ── Label maps ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<TypeFilter, string> = {
  all:  "All types",
  sale: "For sale",
  rent: "For rent",
};

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all:        "All categories",
  apartment:  "Apartment",
  villa:      "Villa",
  house:      "House",
  land:       "Land",
  commercial: "Commercial",
};

const STATUS_LABELS: Record<StatusFilter, string> = {
  all:              "All statuses",
  delivered:        "Delivered",
  finished:         "Finished",
  work_in_progress: "In progress",
};

const AVAILABILITY_LABELS: Record<AvailabilityFilter, string> = {
  all:      "All availability",
  available:"Available",
  sold:     "Sold",
  rented:   "Rented",
  reserved: "Reserved",
};

const FEATURED_LABELS: Record<FeaturedFilter, string> = {
  all:      "Featured & standard",
  featured: "Featured only",
  standard: "Standard only",
};

const AVAILABILITY_CLS: Record<NonNullable<AdminProperty["availability"]>, string> = {
  available: "text-emerald-700",
  sold:      "text-charcoal-roof",
  rented:    "text-charcoal-roof",
  reserved:  "text-text-soft",
};

const STATUS_DISPLAY: Record<AdminProperty["status"], string> = {
  delivered:        "Delivered",
  finished:         "Finished",
  work_in_progress: "In progress",
};

function hasVideo(p: AdminProperty) {
  return Array.isArray(p.videos) && p.videos.length > 0;
}

// ── FilterChip ────────────────────────────────────────────────────────────────

interface ChipProps<T extends string> {
  value: T;
  options: Record<T, string>;
  onChange: (v: T) => void;
}

function FilterChip<T extends string>({ value, options, onChange }: ChipProps<T>) {
  const keys = Object.keys(options) as T[];
  const isActive = value !== keys[0]; // first key is always "all"

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="appearance-none font-body text-xs pl-3 pr-7 py-1.5 rounded cursor-pointer outline-none transition-colors"
        style={{
          background: isActive ? "var(--color-charcoal-roof, #1C1C1E)" : "transparent",
          color:      isActive ? "#F8F5F0" : "var(--color-text-soft, #6B6B6B)",
          border:     `1px solid ${isActive ? "transparent" : "rgba(0,0,0,0.12)"}`,
          letterSpacing: "0.04em",
        }}
      >
        {keys.map((k) => (
          <option key={k} value={k}>{options[k]}</option>
        ))}
      </select>
      {/* Chevron */}
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" style={{ color: isActive ? "#F8F5F0" : "#999", fontSize: 10 }}>
        ▾
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PropertyTable({ properties, onDeleted }: PropertyTableProps) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<AdminProperty | null>(null);
  const [deleting, setDeleting]           = useState(false);
  const [filters, setFilters]             = useState<Filters>(DEFAULTS);

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([k, v]) => v !== DEFAULTS[k as keyof Filters]),
    [filters],
  );

  // ── Client-side filtering ─────────────────────────────────────────────────
  const visible = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return properties.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
      if (filters.type         !== "all" && p.type         !== filters.type)         return false;
      if (filters.category     !== "all" && p.category     !== filters.category)     return false;
      if (filters.status       !== "all" && p.status       !== filters.status)       return false;
      if (filters.availability !== "all" && (p.availability ?? "available") !== filters.availability) return false;
      if (filters.featured === "featured" && !p.featured)  return false;
      if (filters.featured === "standard" &&  p.featured)  return false;
      return true;
    });
  }, [properties, filters]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteProperty(pendingDelete._id);
      onDeleted(pendingDelete._id);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  // ── Filter bar ─────────────────────────────────────────────────────────────
  const filterBar = (
    <div className="flex flex-wrap items-center gap-2 py-3 border-b border-stone-grey/20">
      {/* Search */}
      <div
        className="flex items-center gap-2 flex-1 min-w-[180px] max-w-xs px-3 py-1.5 rounded"
        style={{ border: "1px solid rgba(0,0,0,0.12)" }}
      >
        <Search size={13} className="text-text-soft/50 shrink-0" />
        <input
          type="text"
          placeholder="Search by title, city…"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="flex-1 font-body text-xs bg-transparent outline-none text-charcoal-roof placeholder:text-text-soft/40"
          style={{ letterSpacing: "0.03em" }}
        />
        {filters.search && (
          <button onClick={() => set("search", "")} className="text-text-soft/40 hover:text-charcoal-roof transition-colors">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Dropdown chips */}
      <FilterChip value={filters.type}         options={TYPE_LABELS}         onChange={(v) => set("type", v)} />
      <FilterChip value={filters.category}     options={CATEGORY_LABELS}     onChange={(v) => set("category", v)} />
      <FilterChip value={filters.availability} options={AVAILABILITY_LABELS} onChange={(v) => set("availability", v)} />
      <FilterChip value={filters.status}       options={STATUS_LABELS}       onChange={(v) => set("status", v)} />
      <FilterChip value={filters.featured}     options={FEATURED_LABELS}     onChange={(v) => set("featured", v)} />

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={() => setFilters(DEFAULTS)}
          className="font-body text-xs text-brick-red hover:text-brick-red-dark transition-colors ml-1"
          style={{ letterSpacing: "0.04em" }}
        >
          Clear
        </button>
      )}

      {/* Result count */}
      <span className="font-body text-[11px] text-text-soft/40 ml-auto" style={{ letterSpacing: "0.06em" }}>
        {visible.length} of {properties.length}
      </span>
    </div>
  );

  // ── Empty states ───────────────────────────────────────────────────────────
  if (properties.length === 0) {
    return (
      <div className="border-t border-stone-grey/25 py-16 text-center">
        <p className="font-display text-2xl text-charcoal-roof mb-2">No listings yet</p>
        <p className="font-body text-sm text-text-soft mb-6">
          Add your first property to see it appear here.
        </p>
        <Link
          href="/admin/dashboard/new"
          className="font-body text-xs uppercase text-charcoal-roof border border-charcoal-roof px-6 py-2.5 hover:bg-charcoal-roof hover:text-white transition-colors"
          style={{ letterSpacing: "0.1em" }}
        >
          Add property
        </Link>
      </div>
    );
  }

  return (
    <>
      {filterBar}

      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-xl text-charcoal-roof mb-1">No properties match</p>
          <p className="font-body text-sm text-text-soft mb-4">Try adjusting your filters or search term.</p>
          <button
            onClick={() => setFilters(DEFAULTS)}
            className="font-body text-xs text-brick-red hover:text-brick-red-dark transition-colors"
            style={{ letterSpacing: "0.06em" }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {/* ── Mobile card list ── */}
          <div className="sm:hidden flex flex-col divide-y divide-stone-grey/20">
            {visible.map((property) => {
              const availCls = AVAILABILITY_CLS[property.availability ?? "available"] ?? "text-text-soft";
              const availLabel = AVAILABILITY_LABELS[property.availability ?? "available"];
              return (
                <div
                  key={property._id}
                  onClick={() => router.push(`/admin/dashboard/${property._id}`)}
                  className="py-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-stone-grey/10 overflow-hidden shrink-0 relative">
                      {property.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                      ) : null}
                      {hasVideo(property) && (
                        <span
                          className="absolute bottom-0 left-0 right-0 bg-charcoal-roof/80 text-white text-center"
                          style={{ fontSize: "8px", letterSpacing: "0.1em", padding: "2px 0" }}
                        >
                          VIDEO
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-charcoal-roof group-hover:text-brick-red transition-colors truncate">
                        {property.title}
                        {property.featured && (
                          <span className="ml-2 font-body text-[10px] uppercase text-brick-red" style={{ letterSpacing: "0.1em" }}>
                            Featured
                          </span>
                        )}
                      </p>
                      <p className="font-body text-xs text-text-soft/70 capitalize mt-0.5">
                        {property.city} · {property.type} · {property.category}
                      </p>
                      <p className={`font-body text-xs mt-1 ${availCls}`}>{availLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3" onClick={(e) => e.stopPropagation()}>
                    <span className="font-body text-[10px] uppercase text-text-soft/50" style={{ letterSpacing: "0.1em" }}>
                      {STATUS_DISPLAY[property.status] ?? property.status}
                    </span>
                    <div className="flex gap-5">
                      <Link href={`/admin/dashboard/${property._id}/edit`} className="font-body text-xs text-text-soft hover:text-charcoal-roof transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => setPendingDelete(property)} className="font-body text-xs text-brick-red hover:text-brick-red-dark transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop table ── */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-[1fr_160px_120px_120px_100px] border-b border-stone-grey/25 pb-2 mb-1 mt-2">
              {["Property", "District", "Availability", "Status", ""].map((h) => (
                <span
                  key={h}
                  className="font-body text-[10px] uppercase text-text-soft/40 px-3 first:pl-0"
                  style={{ letterSpacing: "0.12em" }}
                >
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-stone-grey/15">
              {visible.map((property) => {
                const availCls   = AVAILABILITY_CLS[property.availability ?? "available"] ?? "text-text-soft";
                const availLabel = AVAILABILITY_LABELS[property.availability ?? "available"];
                return (
                  <div
                    key={property._id}
                    onClick={() => router.push(`/admin/dashboard/${property._id}`)}
                    className="grid grid-cols-[1fr_160px_120px_120px_100px] items-center py-3 cursor-pointer group hover:bg-stone-grey/5 transition-colors -mx-2 px-2"
                  >
                    {/* Property */}
                    <div className="flex items-center gap-3 pr-4">
                      <div className="w-12 h-12 bg-stone-grey/10 overflow-hidden shrink-0 relative">
                        {property.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                        ) : null}
                        {hasVideo(property) && (
                          <span
                            className="absolute bottom-0 left-0 right-0 bg-charcoal-roof/80 text-white text-center"
                            style={{ fontSize: "7px", letterSpacing: "0.08em", padding: "2px 0" }}
                          >
                            VIDEO
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium text-charcoal-roof group-hover:text-brick-red transition-colors truncate">
                          {property.title}
                        </p>
                        <p className="font-body text-xs text-text-soft/60 capitalize truncate">
                          {property.type} · {property.category}
                          {property.featured && (
                            <span className="ml-2 text-brick-red" style={{ letterSpacing: "0.06em" }}>Featured</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* District */}
                    <span className="font-body text-sm text-text-soft px-3 truncate">{property.city}</span>

                    {/* Availability */}
                    <span className={`font-body text-sm px-3 ${availCls}`}>{availLabel}</span>

                    {/* Status */}
                    <span className="font-body text-[10px] uppercase text-text-soft/50 px-3" style={{ letterSpacing: "0.1em" }}>
                      {STATUS_DISPLAY[property.status] ?? property.status}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-4 justify-end pr-1" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/admin/dashboard/${property._id}/edit`} className="font-body text-xs text-text-soft hover:text-charcoal-roof transition-colors">
                        Edit
                      </Link>
                      <button onClick={() => setPendingDelete(property)} className="font-body text-xs text-brick-red hover:text-brick-red-dark transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {pendingDelete && (
        <ConfirmDeleteModal
          propertyTitle={pendingDelete.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}