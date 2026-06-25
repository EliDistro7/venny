import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Check,
  ChevronLeft,
} from "lucide-react";
import { getProperty, getProperties } from "../../data/properties";
import PropertyCard from "../../components/PropertyCard";
import { Property } from "../../types";
import PropertyImageCarousel from "../../components/PropertyImageCarousel";

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((p: Property) => ({ id: String(p.id) }));
}

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  const [sameCity] = await Promise.all([getProperties({ city: property.city })]);
  const similar = sameCity
    .filter((p: Property) => p.id !== property.id)
    .slice(0, 3);

  const isDelivered = property.status === "delivered";

  // Resolve image list — use images[] if present, fall back to single image
  const imageList =
    property.images && property.images.length > 0
      ? property.images
      : property.image
      ? [property.image]
      : [];

  // Resolve video list
  const videoList = property.videos ?? [];

  return (
    <main style={{ backgroundColor: "#F8F5F0" }} className="min-h-screen pt-20">
      {/* Hero carousel — images + videos */}
      <div className="relative">
        <PropertyImageCarousel
          images={imageList}
          videos={videoList}
          title={property.title}
        />

        {/* Back button — sits above carousel */}
        <Link
          href="/properties"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded font-body text-sm font-bold z-30"
          style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#1C1C1E" }}
        >
          <ChevronLeft size={16} />
          Back to listings
        </Link>

        {/* Title/location overlay */}
        <div className="absolute bottom-6 left-6 right-6 z-20">
          {!isDelivered && (
            <span
              className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body uppercase inline-block mb-3"
              style={{
                backgroundColor: property.type === "sale" ? "#A02B2F" : "#F2C94C",
                color: property.type === "sale" ? "#F8F5F0" : "#1C1C1E",
              }}
            >
              {property.type === "sale" ? "For Sale" : "For Rent"}
            </span>
          )}
          <h1
            className="text-3xl md:text-5xl font-bold mb-2"
            style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
          >
            {property.title}
          </h1>
          <div className="flex items-center gap-1">
            <MapPin size={16} style={{ color: "#F2C94C" }} />
            <span className="font-body" style={{ color: "rgba(248,245,240,0.9)" }}>
              {property.location}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Caption banner */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 12px rgba(28,28,30,0.08)" }}
        >
          <p
            className="text-sm font-bold uppercase tracking-wide font-body"
            style={{ color: "#A02B2F" }}
          >
            {isDelivered
              ? "One of the projects completed by Venny Construction & Real Estate"
              : property.type === "sale"
              ? "For Sale — Contact for Price"
              : "For Rent — Contact for Price"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Quick stats */}
            <div
              className="rounded-xl p-6 mb-8 grid grid-cols-3 gap-4"
              style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 12px rgba(28,28,30,0.08)" }}
            >
              {property.bedrooms > 0 && (
                <div className="text-center">
                  <Bed size={20} style={{ color: "#A02B2F", margin: "0 auto 8px" }} />
                  <p className="font-bold" style={{ color: "#1C1C1E" }}>
                    {property.bedrooms}
                  </p>
                  <p className="text-xs font-body" style={{ color: "#6B6558" }}>
                    Bedrooms
                  </p>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="text-center">
                  <Bath size={20} style={{ color: "#A02B2F", margin: "0 auto 8px" }} />
                  <p className="font-bold" style={{ color: "#1C1C1E" }}>
                    {property.bathrooms}
                  </p>
                  <p className="text-xs font-body" style={{ color: "#6B6558" }}>
                    Bathrooms
                  </p>
                </div>
              )}
              <div className="text-center">
                <Maximize size={20} style={{ color: "#A02B2F", margin: "0 auto 8px" }} />
                <p className="font-bold" style={{ color: "#1C1C1E" }}>
                  {property.area.toLocaleString()} m²
                </p>
                <p className="text-xs font-body" style={{ color: "#6B6558" }}>
                  {property.category === "land" ? "Plot Size" : "Floor Area"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
              >
                About This Property
              </h2>
              <p className="leading-relaxed font-body" style={{ color: "#4A4437" }}>
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
              >
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <Check size={16} style={{ color: "#A02B2F" }} />
                    <span className="font-body text-sm" style={{ color: "#4A4437" }}>
                      {a}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — property meta */}
          <div className="md:col-span-1">
            <div
              className="rounded-xl p-6 sticky top-28"
              style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 12px rgba(28,28,30,0.08)" }}
            >
              <p
                className="text-xs font-bold tracking-wider uppercase mb-4 font-body"
                style={{ color: "#6B6558" }}
              >
                Property Details
              </p>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="font-body text-sm" style={{ color: "#6B6558" }}>
                    Category
                  </dt>
                  <dd
                    className="font-bold text-sm font-body capitalize"
                    style={{ color: "#1C1C1E" }}
                  >
                    {property.category}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-body text-sm" style={{ color: "#6B6558" }}>
                    Listing
                  </dt>
                  <dd className="font-bold text-sm font-body" style={{ color: "#1C1C1E" }}>
                    {isDelivered
                      ? "Completed project"
                      : property.type === "sale"
                      ? "For Sale"
                      : "For Rent"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-body text-sm" style={{ color: "#6B6558" }}>
                    Location
                  </dt>
                  <dd
                    className="font-bold text-sm font-body text-right max-w-[60%]"
                    style={{ color: "#1C1C1E" }}
                  >
                    {property.city}
                  </dd>
                </div>
                {property.bedrooms > 0 && (
                  <div className="flex justify-between">
                    <dt className="font-body text-sm" style={{ color: "#6B6558" }}>
                      Bedrooms
                    </dt>
                    <dd className="font-bold text-sm font-body" style={{ color: "#1C1C1E" }}>
                      {property.bedrooms}
                    </dd>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex justify-between">
                    <dt className="font-body text-sm" style={{ color: "#6B6558" }}>
                      Bathrooms
                    </dt>
                    <dd className="font-bold text-sm font-body" style={{ color: "#1C1C1E" }}>
                      {property.bathrooms}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="font-body text-sm" style={{ color: "#6B6558" }}>
                    {property.category === "land" ? "Plot Size" : "Floor Area"}
                  </dt>
                  <dd className="font-bold text-sm font-body" style={{ color: "#1C1C1E" }}>
                    {property.area.toLocaleString()} m²
                  </dd>
                </div>

                {/* Availability badge — only shown when not "available" */}
                {property.availability && property.availability !== "available" && (
                  <div className="flex justify-between items-center">
                    <dt className="font-body text-sm" style={{ color: "#6B6558" }}>
                      Status
                    </dt>
                    <dd>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold font-body capitalize"
                        style={{
                          backgroundColor:
                            property.availability === "sold" || property.availability === "rented"
                              ? "rgba(160,43,47,0.1)"
                              : "rgba(242,201,76,0.2)",
                          color:
                            property.availability === "sold" || property.availability === "rented"
                              ? "#A02B2F"
                              : "#7A6520",
                        }}
                      >
                        {property.availability}
                      </span>
                    </dd>
                  </div>
                )}
              </dl>

              <div
                style={{
                  borderTop: "1px solid rgba(242,201,76,0.25)",
                  marginTop: "24px",
                  paddingTop: "24px",
                }}
              >
                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-3 rounded font-body text-sm font-bold transition-all hover:opacity-90"
                  style={{ backgroundColor: "#A02B2F", color: "#F8F5F0" }}
                >
                  Enquire About This Property
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2
              className="text-2xl font-bold mb-8"
              style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
            >
              Similar Properties in {property.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similar.map((p: Property) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}