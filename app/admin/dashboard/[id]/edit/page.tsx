"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminProperty } from "@/types/admin";
import { fetchProperty, ApiError } from "@/lib/adminApi";
import PropertyForm from "@/components/admin/PropertyForm";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperty(params.id)
      .then(setProperty)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Could not load this property")
      );
  }, [params.id]);

  if (error) {
    return (
      <div className="rounded-md bg-brick-red/10 border border-brick-red/30 px-4 py-3">
        <p className="font-body text-sm text-brick-red">{error}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl space-y-6 animate-pulse">
        <div>
          <div className="h-8 w-48 bg-stone-grey/20 rounded mb-2" />
          <div className="h-4 w-72 bg-stone-grey/10 rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 w-full bg-stone-grey/10 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl text-charcoal-roof mb-1">Edit property</h1>
      <p className="font-body text-sm text-text-soft mb-8">{property.title}</p>
      <PropertyForm mode="edit" property={property} />
    </div>
  );
}