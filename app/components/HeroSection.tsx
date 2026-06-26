

"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import type { HeroContent } from "@/lib/content";

interface HeroSectionProps {
  cities: string[];
content: Partial<HeroContent>;
}

// Fallback values so the page renders even if the DB block is missing
const DEFAULTS: HeroContent = {
  eyebrow: "Venny Construction & Real Estate Co. Ltd.",
  headingLine1: "Maisha Ni",
  headingAccent: "Nyumba Bora",
  headingLine3: "in Tanzania",
  subheading:
    "From oceanfront villas in Zanzibar to city apartments in Dar es Salaam — discover exceptional properties built and trusted by Venny Construction & Real Estate.",
  searchPlaceholder: "Search by city or neighbourhood...",
  scrollLabel: "SCROLL",
  decorativeWord1: "Nyumba",
  decorativeWord2: "Bora",
  backgroundImage: "/featured/f7.jpeg",
};

export default function HeroSection({ cities, content: raw }: HeroSectionProps) {
  const c = { ...DEFAULTS, ...raw };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={c.backgroundImage}
          alt="Dar es Salaam skyline"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(28,28,30,0.88) 0%, rgba(28,28,30,0.55) 60%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      </div>

      {/* Decorative Swahili type */}
      <div className="absolute top-32 right-8 md:right-16 text-right z-10 hidden md:block">
        <p
          style={{ color: "rgba(160, 43, 47, 0.4)", fontFamily: "Georgia, serif" }}
          className="text-6xl font-bold leading-none select-none"
        >
          {c.decorativeWord1}
        </p>
        <p
          style={{ color: "rgba(160, 43, 47, 0.2)", fontFamily: "Georgia, serif" }}
          className="text-3xl font-light select-none mt-1"
        >
          {c.decorativeWord2}
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        <p
          className="text-sm font-bold tracking-widest uppercase mb-6 font-body"
          style={{ color: "#F2C94C" }}
        >
          {c.eyebrow}
        </p>

        <h1
          className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6"
          style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
        >
          {c.headingLine1}
          <br />
          <span style={{ color: "#F2C94C" }}>{c.headingAccent}</span>
          <br />
          {c.headingLine3}
        </h1>

        <p
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-body leading-relaxed"
          style={{ color: "rgba(248, 245, 240, 0.75)" }}
        >
          {c.subheading}
        </p>

        {/* Search bar */}
        <div
          className="flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden max-w-2xl mx-auto mb-10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex items-center gap-3 flex-1 px-5 py-4">
            <MapPin size={18} style={{ color: "#A02B2F", flexShrink: 0 }} />
            <input
              type="text"
              placeholder={c.searchPlaceholder}
              className="flex-1 outline-none bg-transparent font-body text-sm"
              style={{ color: "#1C1C1E" }}
            />
          </div>
          <Link
            href="/properties"
            className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-sm font-body transition-all"
            style={{ background: "linear-gradient(135deg, #A02B2F, #7E2125)", color: "#F8F5F0" }}
          >
            <Search size={16} />
            Search
          </Link>
        </div>

        {/* City quick-links */}
        <div className="flex flex-wrap justify-center gap-3">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/properties?city=${encodeURIComponent(city)}`}
              className="px-4 py-2 rounded-full text-sm font-body transition-all"
              style={{
                backgroundColor: "rgba(160, 43, 47, 0.18)",
                color: "#F2C94C",
                border: "1px solid rgba(242, 201, 76, 0.3)",
              }}
            >
              {city}
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <div
          className="w-px h-12 animate-pulse"
          style={{ backgroundColor: "rgba(242, 201, 76, 0.5)" }}
        />
        <p className="text-xs font-body tracking-widest" style={{ color: "rgba(242,201,76,0.6)" }}>
          {c.scrollLabel}
        </p>
      </div>
    </section>
  );
}

