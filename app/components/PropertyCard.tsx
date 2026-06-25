import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Video } from "lucide-react";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  work_in_progress: { label: "Work in Progress", color: "#D9822B" },
  finished: { label: "Finished", color: "#2F855A" },
  delivered: { label: "Delivered to Customer", color: "#4A5568" },
};

const categoryLabel: Record<string, string> = {
  apartment: "Apartment",
  villa: "Villa",
  house: "House",
  land: "Land",
  commercial: "Commercial",
};

const availabilityConfig: Record<string, { label: string; color: string }> = {
  sold: { label: "Sold", color: "#1C1C1E" },
  rented: { label: "Rented", color: "#1C1C1E" },
  reserved: { label: "Reserved", color: "#D9822B" },
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const isDelivered = property.status === "delivered";
  const unavailable = property.availability && property.availability !== "available";
  const availBadge = unavailable ? availabilityConfig[property.availability!] : null;
  const hasVideos = (property.videos?.length ?? 0) > 0;

  return (
    <Link href={`/properties/${property.id}`} className="block group">
      <div
        className="rounded-xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 12px rgba(28, 28, 30, 0.08)",
        }}
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              unavailable ? "brightness-75" : ""
            }`}
          />

          {/* Unavailability overlay label */}
          {availBadge && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="px-5 py-2 rounded text-sm font-bold tracking-widest font-body uppercase rotate-[-15deg]"
                style={{
                  backgroundColor: availBadge.color,
                  color: "#FFFFFF",
                  opacity: 0.92,
                  letterSpacing: "0.15em",
                }}
              >
                {availBadge.label}
              </span>
            </div>
          )}

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {!isDelivered && (
              <span
                className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body uppercase"
                style={{
                  backgroundColor: property.type === "sale" ? "#A02B2F" : "#1C1C1E",
                  color: "#FFFFFF",
                }}
              >
                {property.type === "sale" ? "For Sale" : "For Rent"}
              </span>
            )}
            <span
              className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body"
              style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#1C1C1E" }}
            >
              {categoryLabel[property.category]}
            </span>
            {/* Status badge: show for any category that has a status, not just houses */}
            {property.status && (
              <span
                className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body"
                style={{
                  backgroundColor: statusConfig[property.status].color,
                  color: "#FFFFFF",
                }}
              >
                {statusConfig[property.status].label}
              </span>
            )}
          </div>

          {/* Top-right badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            {property.featured && (
              <span
                className="px-2 py-1 rounded text-xs font-bold tracking-wider font-body"
                style={{ backgroundColor: "#F2C94C", color: "#1C1C1E" }}
              >
                ✦ Featured
              </span>
            )}
            {hasVideos && (
              <span
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold font-body"
                style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "#FFFFFF" }}
              >
                <Video size={11} />
                Video
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Caption */}
          <p
            className="text-sm font-bold mb-1 font-body uppercase tracking-wide"
            style={{ color: "#A02B2F" }}
          >
            {isDelivered ? (
              <>One of the projects completed by Venny Construction &amp; Real Estate</>
            ) : property.type === "sale" ? (
              "For Sale — Contact for Price"
            ) : (
              "For Rent — Contact for Price"
            )}
          </p>

          {/* Title */}
          <h3
            className="text-base font-bold mb-2 leading-snug"
            style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 mb-4">
            <MapPin size={13} style={{ color: "#A02B2F", flexShrink: 0 }} />
            <span className="text-xs font-body" style={{ color: "#6B6558" }}>
              {property.location}
            </span>
          </div>

          {/* Stats */}
          {property.category !== "land" ? (
            <div
              className="flex gap-4 pt-4 font-body text-xs"
              style={{
                borderTop: "1px solid rgba(160, 43, 47, 0.12)",
                color: "#6B6558",
              }}
            >
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bed size={13} />
                  {property.bedrooms} Bed{property.bedrooms !== 1 ? "s" : ""}
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath size={13} />
                  {property.bathrooms} Bath{property.bathrooms !== 1 ? "s" : ""}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Maximize size={13} />
                {property.area.toLocaleString()} m²
              </span>
            </div>
          ) : (
            <div
              className="pt-4 font-body text-xs"
              style={{
                borderTop: "1px solid rgba(160, 43, 47, 0.12)",
                color: "#6B6558",
              }}
            >
              <span className="flex items-center gap-1">
                <Maximize size={13} />
                {property.area.toLocaleString()} m² plot
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}