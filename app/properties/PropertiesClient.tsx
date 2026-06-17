"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import { cities, propertyTypes, dealTypes } from "../data/properties";
import { Property } from "../types";

const MAX_PRICE = 3_500_000_000;
const MIN_PRICE = 2_000_000;
const PRICE_STEP = 1_000_000;

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "work_in_progress", label: "Work in Progress" },
  { value: "finished", label: "Finished" },
  { value: "delivered", label: "Delivered to Customer" },
];

const formatTZS = (amount: number) =>
  `TSh ${new Intl.NumberFormat("en-TZ").format(amount)}`;

export default function PropertiesClient({
  properties = [],
}: {
  properties?: Property[];
}) {
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "All Cities");
  const [category, setCategory] = useState("All Types");
  const [deal, setDeal] = useState(searchParams.get("type") || "All");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    if (!Array.isArray(properties)) return [];

    return properties.filter((p) => {
      const cityMatch = city === "All Cities" || p.city === city;
      const categoryMatch = category === "All Types" || p.category === category;
      const dealMatch = deal === "All" || p.type === deal;
      const priceMatch = p.price <= maxPrice;
      // Status only narrows results when a specific status is chosen AND the
      // property has a status field — land/commercial don't carry one.
      const statusMatch =
        status === "all" || p.status === status;
      return cityMatch && categoryMatch && dealMatch && priceMatch && statusMatch;
    });
  }, [properties, city, category, deal, maxPrice, status]);

  const resetFilters = () => {
    setCity("All Cities");
    setCategory("All Types");
    setDeal("All");
    setMaxPrice(MAX_PRICE);
    setStatus("all");
  };

  return (
    <main style={{ backgroundColor: "#F8F5F0" }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: "#1C1C1E" }} className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3 font-body"
            style={{ color: "#F2C94C" }}
          >
            Browse Listings
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
          >
            All Properties
          </h1>
          <p className="mt-3 font-body" style={{ color: "rgba(248, 245, 240, 0.6)" }}>
            {filtered.length} {filtered.length === 1 ? "property" : "properties"} available across Tanzania
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 mb-6 px-4 py-2 rounded font-body text-sm font-bold"
          style={{ backgroundColor: "#1C1C1E", color: "#F8F5F0" }}
        >
          <SlidersHorizontal size={16} />
          {showFilters ? "Hide Filters" : "Filters"}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block md:col-span-1`}>
            <div
              className="rounded-xl p-6 sticky top-28"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 12px rgba(28,28,30,0.08)",
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="font-bold text-lg"
                  style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
                >
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs font-body font-bold"
                  style={{ color: "#A02B2F" }}
                >
                  Reset
                </button>
              </div>

              {/* Deal type */}
              <div className="mb-6">
                <p
                  className="text-xs font-bold tracking-wider uppercase mb-3 font-body"
                  style={{ color: "#6B6558" }}
                >
                  Listing Type
                </p>
                <div className="flex gap-2">
                  {dealTypes.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDeal(d)}
                      className="flex-1 px-3 py-2 rounded text-xs font-bold font-body capitalize transition-colors"
                      style={{
                        backgroundColor: deal === d ? "#A02B2F" : "#F8F5F0",
                        color: deal === d ? "#F8F5F0" : "#6B6558",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div className="mb-6">
                <p
                  className="text-xs font-bold tracking-wider uppercase mb-3 font-body"
                  style={{ color: "#6B6558" }}
                >
                  City
                </p>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm font-body outline-none"
                  style={{
                    backgroundColor: "#F8F5F0",
                    color: "#1C1C1E",
                    border: "1px solid rgba(242,201,76,0.3)",
                  }}
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="mb-6">
                <p
                  className="text-xs font-bold tracking-wider uppercase mb-3 font-body"
                  style={{ color: "#6B6558" }}
                >
                  Property Type
                </p>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm font-body outline-none capitalize"
                  style={{
                    backgroundColor: "#F8F5F0",
                    color: "#1C1C1E",
                    border: "1px solid rgba(242,201,76,0.3)",
                  }}
                >
                  {propertyTypes.map((t) => (
                    <option key={t} value={t} className="capitalize">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Status */}
              <div className="mb-6">
                <p
                  className="text-xs font-bold tracking-wider uppercase mb-3 font-body"
                  style={{ color: "#6B6558" }}
                >
                  Project Status
                </p>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm font-body outline-none"
                  style={{
                    backgroundColor: "#F8F5F0",
                    color: "#1C1C1E",
                    border: "1px solid rgba(242,201,76,0.3)",
                  }}
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <p
                  className="text-xs font-bold tracking-wider uppercase mb-1 font-body"
                  style={{ color: "#6B6558" }}
                >
                  Max Price
                </p>
                <p
                  className="text-sm font-bold font-body mb-3"
                  style={{ color: "#1C1C1E" }}
                >
                  {formatTZS(maxPrice)}
                </p>
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={PRICE_STEP}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "#A02B2F" }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs font-body" style={{ color: "#6B6558" }}>
                    {formatTZS(MIN_PRICE)}
                  </span>
                  <span className="text-xs font-body" style={{ color: "#6B6558" }}>
                    {formatTZS(MAX_PRICE)}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="md:col-span-3">
            {filtered.length === 0 ? (
              <div
                className="rounded-xl p-16 text-center"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <X size={32} style={{ color: "#A02B2F", margin: "0 auto 16px" }} />
                <p
                  className="font-bold text-lg mb-2"
                  style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
                >
                  No properties match your filters
                </p>
                <p className="text-sm font-body" style={{ color: "#6B6558" }}>
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}