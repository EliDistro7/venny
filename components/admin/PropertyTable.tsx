"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminProperty } from "@/types/admin";
import { deleteProperty } from "@/lib/adminApi";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface PropertyTableProps {
  properties: AdminProperty[];
  onDeleted: (id: string) => void;
}

function formatPrice(price: number, currency: string) {
  return `${currency} ${price.toLocaleString()}`;
}

export default function PropertyTable({ properties, onDeleted }: PropertyTableProps) {
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
      <div className="bg-white border border-stone-grey/20 rounded-lg p-8 sm:p-12 text-center">
        <p className="font-display text-xl text-charcoal-roof mb-2">No listings yet</p>
        <p className="font-body text-sm text-text-soft mb-6">
          Add your first property to see it appear here.
        </p>
        <Link
          href="/admin/dashboard/new"
          className="inline-block font-body text-sm bg-brick-red text-white px-5 py-2.5 rounded-md hover:bg-brick-red-dark transition-colors"
        >
          Add property
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile card list (hidden sm and up) ── */}
      <div className="sm:hidden flex flex-col gap-3">
        {properties.map((property) => (
          <div
            key={property._id}
            className="bg-white border border-stone-grey/20 rounded-lg px-4 py-4"
          >
            <div className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-md bg-mist overflow-hidden shrink-0 border border-stone-grey/20">
                {property.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-charcoal-roof truncate">
                  {property.title}
                </p>
                <p className="font-body text-xs text-text-soft/70 capitalize mt-0.5">
                  {property.city} · {property.type} · {property.category}
                  {property.featured && (
                    <span className="ml-1.5 text-brick-red font-medium">★ Featured</span>
                  )}
                </p>
                <p className="font-body text-sm text-text-soft mt-1 whitespace-nowrap">
                  {formatPrice(property.price, property.currency)}
                </p>
              </div>
            </div>

            {/* Footer row: status badge + actions */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-grey/10">
              <span
                className={`font-body text-xs px-2.5 py-1 rounded-full ${
                  property.status === "delivered"
                    ? "bg-charcoal-roof/5 text-charcoal-roof"
                    : "bg-window-gold/15 text-charcoal-roof"
                }`}
              >
                {property.status === "delivered" ? "Delivered" : "Work in progress"}
              </span>

              <div className="flex gap-4">
                <Link
                  href={`/admin/dashboard/${property._id}/edit`}
                  className="font-body text-sm text-charcoal-roof hover:text-brick-red transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setPendingDelete(property)}
                  className="font-body text-sm text-brick-red hover:text-brick-red-dark transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table (hidden below sm) ── */}
      <div className="hidden sm:block bg-white border border-stone-grey/20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-grey/20 text-left">
              <th className="font-body text-xs uppercase tracking-wide text-text-soft/70 px-5 py-3">
                Property
              </th>
              <th className="font-body text-xs uppercase tracking-wide text-text-soft/70 px-5 py-3">
                City
              </th>
              <th className="font-body text-xs uppercase tracking-wide text-text-soft/70 px-5 py-3">
                Price
              </th>
              <th className="font-body text-xs uppercase tracking-wide text-text-soft/70 px-5 py-3">
                Status
              </th>
              <th className="font-body text-xs uppercase tracking-wide text-text-soft/70 px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property._id} className="border-b border-stone-grey/10 last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-mist overflow-hidden shrink-0 border border-stone-grey/20">
                      {property.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-charcoal-roof">
                        {property.title}
                      </p>
                      <p className="font-body text-xs text-text-soft/70 capitalize">
                        {property.type} · {property.category}
                        {property.featured && (
                          <span className="ml-2 text-brick-red font-medium">★ Featured</span>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-body text-sm text-text-soft">{property.city}</td>
                <td className="px-5 py-4 font-body text-sm text-text-soft whitespace-nowrap">
                  {formatPrice(property.price, property.currency)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`font-body text-xs px-2.5 py-1 rounded-full ${
                      property.status === "delivered"
                        ? "bg-charcoal-roof/5 text-charcoal-roof"
                        : "bg-window-gold/15 text-charcoal-roof"
                    }`}
                  >
                    {property.status === "delivered" ? "Delivered" : "Work in progress"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/dashboard/${property._id}/edit`}
                    className="font-body text-sm text-charcoal-roof hover:text-brick-red transition-colors mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setPendingDelete(property)}
                    className="font-body text-sm text-brick-red hover:text-brick-red-dark transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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