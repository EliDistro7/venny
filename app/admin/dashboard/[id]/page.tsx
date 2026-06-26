"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminProperty } from "@/types/admin";
import { fetchProperty, deleteProperty } from "@/lib/adminApi";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number | undefined | null, currency?: string | null) {
  if (n == null || isNaN(n)) return "—";
  const num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
  return currency ? `${currency} ${num}` : num;
}

const AVAILABILITY_MAP: Record<
  NonNullable<AdminProperty["availability"]>,
  { label: string; cls: string }
> = {
  available: { label: "Available", cls: "text-emerald-700" },
  sold:      { label: "Sold",      cls: "text-charcoal-roof" },
  rented:    { label: "Rented",    cls: "text-charcoal-roof" },
  reserved:  { label: "Reserved",  cls: "text-text-soft" },
};

const STATUS_MAP: Record<AdminProperty["status"], string> = {
  delivered:        "Delivered",
  finished:         "Finished",
  work_in_progress: "Work in progress",
};

// ── Typographic stat block ─────────────────────────────────────────────────

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col gap-1 py-5 border-r border-stone-grey/20 last:border-r-0 px-6 first:pl-0">
      <span className="font-display text-3xl text-charcoal-roof leading-none">{value}</span>
      <span
        className="font-body text-[10px] uppercase tracking-widest text-text-soft/60"
        style={{ letterSpacing: "0.12em" }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Section heading (hairline rule + display label) ────────────────────────

function SectionHead({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="block w-6 h-px bg-brick-red shrink-0" />
      <h2 className="font-display text-xl text-charcoal-roof tracking-wide">{title}</h2>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProperty(id)
      .then((p) => { setProperty(p); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [id]);

  async function handleDelete() {
    if (!property) return;
    setDeleting(true);
    try {
      await deleteProperty(property._id);
      router.push("/admin/dashboard");
    } finally {
      setDeleting(false);
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-brick-red border-t-transparent animate-spin" />
          <p className="font-body text-sm text-text-soft">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !property) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-display text-3xl text-charcoal-roof mb-2">Property not found</p>
          <p className="font-body text-sm text-text-soft mb-6">{error ?? "It may have been deleted."}</p>
          <Link href="/admin/dashboard" className="font-body text-sm text-brick-red hover:text-brick-red-dark transition-colors">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const avail = AVAILABILITY_MAP[property.availability ?? "available"];
  const amenitiesList = property.amenities ?? [];

  return (
    <div className="min-h-screen bg-mist">

      {/* ── Top bar — charcoal anchor ── */}
      <div className="bg-charcoal-roof">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="font-body text-xs uppercase tracking-widest text-stone-grey hover:text-white transition-colors"
            style={{ letterSpacing: "0.1em" }}
          >
            ← Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/dashboard/${property._id}/edit`}
              className="font-body text-xs uppercase tracking-widest text-stone-grey hover:text-white transition-colors px-4 py-2 border border-stone-grey/30 hover:border-white"
              style={{ letterSpacing: "0.1em" }}
            >
              Edit
            </Link>
            <button
              onClick={() => setConfirmDelete(true)}
              className="font-body text-xs uppercase tracking-widest text-brick-red hover:text-white hover:bg-brick-red transition-colors px-4 py-2 border border-brick-red"
              style={{ letterSpacing: "0.1em" }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ── Image gallery ── */}
      {property.images.length > 0 && (
        <div className="border-b border-stone-grey/25">
          <div className="w-full aspect-[16/9] overflow-hidden bg-stone-grey/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={property.images[activeImage]}
              alt={`${property.title} — image ${activeImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          {property.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-3 border-t border-stone-grey/15">
              {property.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-16 h-16 overflow-hidden transition-all ${
                    i === activeImage
                      ? "outline outline-2 outline-brick-red outline-offset-1"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Hero header ── */}
        <div className="pt-10 pb-8 border-b border-stone-grey/25">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex-1">
              {property.featured && (
                <p
                  className="font-body text-[10px] uppercase text-brick-red mb-3"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Featured listing
                </p>
              )}
              <h1 className="font-display text-4xl sm:text-5xl text-charcoal-roof leading-tight">
                {property.title}
              </h1>
              <p className="font-body text-sm text-text-soft mt-2 capitalize">
                {property.location}, {property.city}
              </p>
            </div>

            {/* Availability + status — typographic, no badges */}
            <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
              <span className={`font-display text-2xl ${avail.cls}`}>
                {avail.label}
              </span>
              <span
                className="font-body text-[10px] uppercase text-text-soft/60 tracking-widest"
                style={{ letterSpacing: "0.12em" }}
              >
                {STATUS_MAP[property.status] ?? property.status}
              </span>
            </div>
          </div>

          {/* Price line */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-5xl sm:text-6xl text-charcoal-roof leading-none">
              {fmt(property.price, property.currency)}
            </span>
            {property.type === "rent" && (
              <span className="font-body text-sm text-text-soft">/ month</span>
            )}
          </div>
        </div>

        {/* ── Spec row ── */}
        <div className="flex flex-wrap border-b border-stone-grey/25 py-1">
          {property.bedrooms > 0 && (
            <Stat value={property.bedrooms} label="Bedrooms" />
          )}
          {property.bathrooms > 0 && (
            <Stat value={property.bathrooms} label="Bathrooms" />
          )}
          {property.area > 0 && (
            <Stat value={`${property.area} m²`} label="Floor area" />
          )}
          <Stat
            value={property.type === "rent" ? "Rent" : "Sale"}
            label="Listing type"
          />
          <Stat value={property.category} label="Category" />
        </div>

        {/* ── Description ── */}
        {property.description && (
          <div className="py-10 border-b border-stone-grey/25">
            <SectionHead title="Description" />
            <p className="font-body text-sm text-text-soft leading-loose whitespace-pre-line max-w-2xl">
              {property.description}
            </p>
          </div>
        )}

        {/* ── Amenities ── */}
        {amenitiesList.length > 0 && (
          <div className="py-10 border-b border-stone-grey/25">
            <SectionHead title="Amenities" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
              {amenitiesList.map((a) => (
                <div key={a} className="flex items-center gap-3">
                  <span className="block w-3 h-px bg-stone-grey/50 shrink-0" />
                  <span className="font-body text-sm text-text-soft capitalize">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Videos ── */}
        {property.videos && property.videos.length > 0 && (
          <div className="py-10 border-b border-stone-grey/25">
            <SectionHead title="Video" />
            <div className="space-y-4">
              {property.videos.map((url, i) => (
                <video
                  key={i}
                  src={url}
                  controls
                  className="w-full"
                  style={{ maxHeight: "420px" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Listing meta ── */}
        <div className="py-10 border-b border-stone-grey/25">
          <SectionHead title="Listing info" />
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-16">
            {(
              [
                ["ID",      property._id],
                ["City",    property.city],
                ["Created", new Date(property.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
                ["Updated", new Date(property.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k}>
                <dt
                  className="font-body text-[10px] uppercase text-text-soft/50 mb-0.5"
                  style={{ letterSpacing: "0.12em" }}
                >
                  {k}
                </dt>
                <dd className="font-body text-sm text-charcoal-roof break-all">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Bottom actions ── */}
        <div className="flex gap-4 py-10">
          <Link
            href={`/admin/dashboard/${property._id}/edit`}
            className="font-body text-xs uppercase tracking-widest bg-charcoal-roof text-white px-8 py-3 hover:bg-charcoal-roof/80 transition-colors"
            style={{ letterSpacing: "0.1em" }}
          >
            Edit property
          </Link>
          <button
            onClick={() => setConfirmDelete(true)}
            className="font-body text-xs uppercase tracking-widest text-text-soft border border-stone-grey/30 px-8 py-3 hover:border-brick-red hover:text-brick-red transition-colors"
            style={{ letterSpacing: "0.1em" }}
          >
            Delete
          </button>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDeleteModal
          propertyTitle={property.title}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          deleting={deleting}
        />
      )}
    </div>
  );
}