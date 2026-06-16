import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Check,
  Phone,
  Mail,
  ChevronLeft,
} from "lucide-react";
import { properties, agents } from "../../data/properties";
import PropertyCard from "../../components/PropertyCard";

export function generateStaticParams() {
  return properties.map((p) => ({ id: String(p.id) }));
}

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = properties.find((p) => p.id === Number(id));

  if (!property) notFound();

  const agent = agents[property.id % agents.length];
  const similar = properties
    .filter((p) => p.id !== property.id && p.city === property.city)
    .slice(0, 3);

  const formatPrice = () => {
    const formatted = new Intl.NumberFormat("en-US").format(property.price);
    return property.type === "rent"
      ? `${property.currency} ${formatted}/mo`
      : `${property.currency} ${formatted}`;
  };

  return (
    <main style={{ backgroundColor: "#F8F5F0" }} className="min-h-screen pt-20">
      {/* Hero image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <Image src={property.image} alt={property.title} fill className="object-cover" priority />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(28,28,30,0.7) 0%, rgba(28,28,30,0.1) 50%)",
          }}
        />
        <Link
          href="/properties"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded font-body text-sm font-bold"
          style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#1C1C1E" }}
        >
          <ChevronLeft size={16} />
          Back to listings
        </Link>
        <div className="absolute bottom-6 left-6 right-6">
          <span
            className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body uppercase inline-block mb-3"
            style={{
              backgroundColor: property.type === "sale" ? "#A02B2F" : "#F2C94C",
              color: property.type === "sale" ? "#F8F5F0" : "#1C1C1E",
            }}
          >
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </span>
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
                  <p className="font-bold" style={{ color: "#1C1C1E" }}>{property.bedrooms}</p>
                  <p className="text-xs font-body" style={{ color: "#6B6558" }}>Bedrooms</p>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="text-center">
                  <Bath size={20} style={{ color: "#A02B2F", margin: "0 auto 8px" }} />
                  <p className="font-bold" style={{ color: "#1C1C1E" }}>{property.bathrooms}</p>
                  <p className="text-xs font-body" style={{ color: "#6B6558" }}>Bathrooms</p>
                </div>
              )}
              <div className="text-center">
                <Maximize size={20} style={{ color: "#A02B2F", margin: "0 auto 8px" }} />
                <p className="font-bold" style={{ color: "#1C1C1E" }}>{property.area.toLocaleString()} m²</p>
                <p className="text-xs font-body" style={{ color: "#6B6558" }}>
                  {property.category === "land" ? "Plot Size" : "Floor Area"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}>
                About This Property
              </h2>
              <p className="leading-relaxed font-body" style={{ color: "#4A4437" }}>
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}>
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <Check size={16} style={{ color: "#A02B2F" }} />
                    <span className="font-body text-sm" style={{ color: "#4A4437" }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div
              className="rounded-xl p-6 sticky top-28"
              style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 12px rgba(28,28,30,0.08)" }}
            >
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: "#A02B2F", fontFamily: "Georgia, serif" }}
              >
                {formatPrice()}
              </p>
              <p className="text-sm font-body mb-6" style={{ color: "#6B6558" }}>
                {property.type === "sale" ? "Purchase price" : "Monthly rent"}
              </p>

              <div
                style={{ borderTop: "1px solid rgba(242,201,76,0.25)", paddingTop: "24px" }}
              >
                <p className="text-xs font-bold tracking-wider uppercase mb-4 font-body" style={{ color: "#6B6558" }}>
                  Listing Agent
                </p>
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#1C1C1E" }}>{agent.name}</p>
                    <p className="text-xs font-body" style={{ color: "#A02B2F" }}>{agent.role}</p>
                  </div>
                </div>

                
                 <a href={`tel:${agent.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded font-bold text-sm font-body mb-3"
                  style={{ background: "linear-gradient(135deg, #A02B2F, #7E2125)", color: "#F8F5F0" }}
                >
                  <Phone size={15} />
                  {agent.phone}
                </a>
                
                 <a href={`mailto:${agent.email}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded font-bold text-sm font-body"
                  style={{ backgroundColor: "#1C1C1E", color: "#F8F5F0" }}
                >
                  <Mail size={15} />
                  Email Agent
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8" style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}>
              Similar Properties in {property.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}