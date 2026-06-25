import { Property } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function normalize(doc: any): Property {
  const imgs: string[] = doc.images?.length ? doc.images : doc.image ? [doc.image] : [];
  return {
    ...doc,
    id: doc._id,
    image: imgs[0] ?? "",
    images: imgs,
    videos: doc.videos ?? [],
    status: doc.status ?? undefined,
    availability: doc.availability ?? "available",
  } as Property;
}

export async function getProperties(params?: {
  city?: string;
  type?: string;
  category?: string;
  featured?: boolean;
  availability?: string;
  status?: string;
}): Promise<Property[]> {
  const query = new URLSearchParams();
  if (params?.city) query.set("city", params.city);
  if (params?.type) query.set("type", params.type);
  if (params?.category) query.set("category", params.category);
  if (params?.featured !== undefined) query.set("featured", String(params.featured));
  if (params?.availability) query.set("availability", params.availability);
  if (params?.status) query.set("status", params.status);

  const res = await fetch(`${API_URL}/api/properties?${query.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return (await res.json()).map(normalize);
}

export async function getCities(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/properties/cities`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return ["All Cities"];
  return res.json();
}

export async function getCityStats(): Promise<{ city: string; count: number; image: string }[]> {
  const res = await fetch(`${API_URL}/api/properties/cities/stats`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getProperty(id: string): Promise<Property | null> {
  const res = await fetch(`${API_URL}/api/properties/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return normalize(await res.json());
}

export const propertyTypes = [
  "All Types",
  "apartment",
  "villa",
  "house",
  "land",
  "commercial",
];

export const dealTypes = ["All", "sale", "rent"];

export const availabilityTypes = ["available", "sold", "rented", "reserved"];

export const statusTypes = [
  "all",
  "work_in_progress",
  "finished",
  "delivered",
];