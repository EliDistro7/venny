"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminProperty } from "@/types/admin";
import { fetchProperties } from "@/lib/adminApi";
import PropertyTable from "@/components/admin/PropertyTable";
import StatCard from "@/components/admin/StatCard";

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
    <div>
      {/* Stack on mobile, side-by-side from sm up */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-charcoal-roof">Properties</h1>
          <p className="font-body text-sm text-text-soft mt-1">
            Manage every listing shown on the public site.
          </p>
        </div>
        {/* Full-width tap target on mobile */}
        <Link
          href="/admin/dashboard/new"
          className="w-full sm:w-auto text-center font-body text-sm bg-brick-red text-white px-5 py-3 sm:py-2.5 rounded-md hover:bg-brick-red-dark transition-colors shrink-0"
        >
          Add property
        </Link>
      </div>

      {properties && (
        // 2-up on mobile, 4-up from sm up
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard label="Total listings" value={properties.length} />
          <StatCard label="For sale" value={properties.filter((p) => p.type === "sale").length} />
          <StatCard label="For rent" value={properties.filter((p) => p.type === "rent").length} />
          <StatCard label="Featured" value={properties.filter((p) => p.featured).length} accent />
        </div>
      )}

      {error && (
        <div className="bg-brick-red/10 border border-brick-red/30 text-brick-red font-body text-sm rounded-md px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {properties ? (
        <PropertyTable properties={properties} onDeleted={handleDeleted} />
      ) : (
        !error && <p className="font-body text-sm text-text-soft">Loading…</p>
      )}
    </div>
  );
}