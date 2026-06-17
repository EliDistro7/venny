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
    return <p className="font-body text-sm text-brick-red">{error}</p>;
  }

  if (!property) {
    return <p className="font-body text-sm text-text-soft">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl text-charcoal-roof mb-1">Edit property</h1>
      <p className="font-body text-sm text-text-soft mb-8">{property.title}</p>
      <PropertyForm mode="edit" property={property} />
    </div>
  );
}
