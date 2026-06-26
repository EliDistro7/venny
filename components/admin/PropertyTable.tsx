"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminProperty } from "@/types/admin";
import { deleteProperty } from "@/lib/adminApi";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface PropertyTableProps {
  properties: AdminProperty[];
  onDeleted: (id: string) => void;
}

// ── Tiny helpers ──────────────────────────────────────────────────────────

const AVAILABILITY: Record<NonNullable<AdminProperty["availability"]>, { label: string; cls: string }> = {
  available: { label: "Available", cls: "text-emerald-700" },
  sold:      { label: "Sold",      cls: "text-charcoal-roof" },
  rented:    { label: "Rented",    cls: "text-charcoal-roof" },
  reserved:  { label: "text-text-soft", cls: "text-text-soft" },
};

const STATUS: Record<AdminProperty["status"], string> = {
  delivered:        "Delivered",
  finished:         "Finished",
  work_in_progress: "In progress",
};

function hasVideo(property: AdminProperty) {
  return Array.isArray(property.videos) && property.videos.length > 0;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PropertyTable({ properties, onDeleted }: PropertyTableProps) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<AdminProperty | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      {/* ── Mobile card list ── */}
      <div className="sm:hidden flex flex-col divide-y divide-stone-grey/20">
        {properties.map((property) => {
          const avail = AVAILABILITY[property.availability ?? "available"] ?? AVAILABILITY.available;
          return (
            <div
              key={property._id}
              onClick={() => router.push(`/admin/dashboard/${property._id}`)}
              className="py-4 cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-stone-grey/10 overflow-hidden shrink-0 relative">
                  {property.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
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

                {/* Info */}
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
                  <p className={`font-body text-xs mt-1 ${avail.cls}`}>{avail.label}</p>
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between mt-3"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="font-body text-[10px] uppercase text-text-soft/50"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {STATUS[property.status] ?? property.status}
                </span>
                <div className="flex gap-5">
                  <Link
                    href={`/admin/dashboard/${property._id}/edit`}
                    className="font-body text-xs text-text-soft hover:text-charcoal-roof transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setPendingDelete(property)}
                    className="font-body text-xs text-brick-red hover:text-brick-red-dark transition-colors"
                  >
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
        {/* Header row */}
        <div className="grid grid-cols-[1fr_160px_120px_120px_100px] border-b border-stone-grey/25 pb-2 mb-1">
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

        {/* Rows */}
        <div className="divide-y divide-stone-grey/15">
          {properties.map((property) => {
            const avail = AVAILABILITY[property.availability ?? "available"] ?? AVAILABILITY.available;
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
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
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
                        <span
                          className="ml-2 text-brick-red"
                          style={{ letterSpacing: "0.06em" }}
                        >
                          Featured
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* District */}
                <span className="font-body text-sm text-text-soft px-3 truncate">
                  {property.city}
                </span>

                {/* Availability */}
                <span className={`font-body text-sm px-3 ${avail.cls}`}>
                  {avail.label}
                </span>

                {/* Status */}
                <span
                  className="font-body text-[10px] uppercase text-text-soft/50 px-3"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {STATUS[property.status] ?? property.status}
                </span>

                {/* Actions */}
                <div
                  className="flex gap-4 justify-end pr-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={`/admin/dashboard/${property._id}/edit`}
                    className="font-body text-xs text-text-soft hover:text-charcoal-roof transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setPendingDelete(property)}
                    className="font-body text-xs text-brick-red hover:text-brick-red-dark transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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