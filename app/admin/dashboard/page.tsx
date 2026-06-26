"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminProperty } from "@/types/admin";
import { fetchProperties } from "@/lib/adminApi";
import PropertyTable from "@/components/admin/PropertyTable";

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 py-6 border-r border-stone-grey/20 last:border-r-0 px-6 first:pl-0">
      <span className="font-display text-5xl text-charcoal-roof leading-none">{value}</span>
      <span
        className="font-body text-[10px] uppercase text-text-soft/60"
        style={{ letterSpacing: "0.12em" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<AdminProperty[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch(() => setError("Could not load properties. Is the API running?"));
  }, []);

  function handleDeleted(id: string) {
    setProperties((prev) => prev?.filter((p) => p._id !== id) ?? null);
  }

  return (
    <div className="min-h-screen bg-mist">

      {/* ── Page header ── */}
      <div className="bg-charcoal-roof">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-end justify-between gap-4">
          <div>
            <p
              className="font-body text-[10px] uppercase text-stone-grey/60 mb-1"
              style={{ letterSpacing: "0.15em" }}
            >
              Admin
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight">
              Properties
            </h1>
          </div>
          <Link
            href="/admin/dashboard/new"
            className="font-body text-xs uppercase text-white border border-white/30 px-5 py-2.5 hover:bg-white hover:text-charcoal-roof transition-colors shrink-0"
            style={{ letterSpacing: "0.1em" }}
          >
            Add property
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Stats row ── */}
        {properties && (
          <div className="flex flex-wrap border-b border-stone-grey/25">
            <StatBlock label="Total listings" value={properties.length} />
            <StatBlock label="For sale"       value={properties.filter((p) => p.type === "sale").length} />
            <StatBlock label="For rent"       value={properties.filter((p) => p.type === "rent").length} />
            <StatBlock label="Featured"       value={properties.filter((p) => p.featured).length} />
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <p className="font-body text-sm text-brick-red py-6 border-b border-stone-grey/25">
            {error}
          </p>
        )}

        {/* ── Table ── */}
        <div className="py-8">
          {properties ? (
            <PropertyTable properties={properties} onDeleted={handleDeleted} />
          ) : (
            !error && (
              <p
                className="font-body text-[10px] uppercase text-text-soft/50 py-6"
                style={{ letterSpacing: "0.1em" }}
              >
                Loading…
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}