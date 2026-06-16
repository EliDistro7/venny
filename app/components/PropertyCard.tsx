import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, type: string) => {
    const formatted = `TSh ${new Intl.NumberFormat("en-TZ").format(price)}`;
    return type === "rent" ? `${formatted}/mo` : formatted;
  };

  const categoryLabel: Record<string, string> = {
    apartment: "Apartment",
    villa: "Villa",
    house: "House",
    land: "Land",
    commercial: "Commercial",
  };

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
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body uppercase"
              style={{
                backgroundColor: property.type === "sale" ? "#A02B2F" : "#1C1C1E",
                color: "#FFFFFF",
              }}
            >
              {property.type === "sale" ? "For Sale" : "For Rent"}
            </span>
            <span
              className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body"
              style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#1C1C1E" }}
            >
              {categoryLabel[property.category]}
            </span>
          </div>
          {property.featured && (
            <div className="absolute top-3 right-3">
              <span
                className="px-2 py-1 rounded text-xs font-bold tracking-wider font-body"
                style={{ backgroundColor: "#F2C94C", color: "#1C1C1E" }}
              >
                ✦ Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price */}
          <p
            className="text-2xl font-bold mb-1 font-display"
            style={{ color: "#A02B2F" }}
          >
            {formatPrice(property.price, property.type)}
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
          {property.category !== "land" && (
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
          )}
          {property.category === "land" && (
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