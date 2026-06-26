import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Shield, Users, ChevronRight } from "lucide-react";
import PropertyCard from "./components/PropertyCard";
import HeroSection from "./components/HeroSection";
import { getProperties, getCities, getCityStats } from "./data/properties";
import { getAllContent } from "@/lib/content";
import type { WhyUsContent, CtaContent, FeaturedContent, LocationsContent, StatsContent } from "@/lib/content";

export default async function Home() {
  const [allFeatured, cities, cityStats, content] = await Promise.all([
    getProperties({ featured: true }),
    getCities(),
    getCityStats(),
    getAllContent(),
  ]);

  const featured = allFeatured.slice(0, 5);
  const displayCities = cities.filter((c) => c !== "All Cities");

  const spotlightCities = cityStats.slice(0, 7).map((s, i) => ({
    ...s,
    size: i === 0 ? "md:col-span-2 md:row-span-2" : "",
  }));

  const stats: StatsContent = {
    items: content.stats?.items?.length
      ? content.stats.items
      : [
          { num: "1,200+", label: "Properties Listed" },
          { num: "850+",   label: "Happy Clients" },
          { num: `${displayCities.length}`, label: "Cities Covered" },
          { num: "15+",    label: "Years Experience" },
        ],
  };

  const featured_c: FeaturedContent = {
    eyebrow:      content.featured?.eyebrow      ?? "Handpicked for You",
    heading:      content.featured?.heading      ?? "Featured Properties",
    viewAllLabel: content.featured?.viewAllLabel ?? "View All Properties",
  };

  const locations_c: LocationsContent = {
    eyebrow: content.locations?.eyebrow ?? "Explore Tanzania",
    heading: content.locations?.heading ?? "Properties by Destination",
  };

  const whyus: WhyUsContent = {
    eyebrow: content.whyus?.eyebrow ?? "Why Venny Construction",
    heading: content.whyus?.heading ?? "The Trusted Way to\nBuy & Sell in Tanzania",
    cards:   content.whyus?.cards?.length
      ? content.whyus.cards
      : [
          { icon: "Shield",     title: "Verified Listings",   desc: "Every property is physically inspected and legally verified before appearing on our platform. No surprises." },
          { icon: "Users",      title: "Expert Local Agents", desc: "Our bilingual agents (Swahili & English) understand Tanzania's property market better than anyone." },
          { icon: "TrendingUp", title: "Market Intelligence", desc: "Access real price data, neighbourhood insights, and investment analysis to make confident decisions." },
        ],
  };

  const cta: CtaContent = {
    eyebrow:         content.cta?.eyebrow         ?? "Own Property in Tanzania?",
    heading:         content.cta?.heading         ?? "List With Venny\n& Reach Thousands",
    subheading:      content.cta?.subheading      ?? "Connect with verified buyers and renters across Tanzania and the diaspora. Free listing for first 30 days.",
    buttonLabel:     content.cta?.buttonLabel     ?? "List Your Property Free",
    buttonHref:      content.cta?.buttonHref      ?? "/contact",
    backgroundImage: content.cta?.backgroundImage ?? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80",
  };

  const ICON_MAP = { Shield, Users, TrendingUp };

  return (
    <main>
      {/* ─── HERO ─── */}
      <HeroSection cities={displayCities} content={content.hero ?? {}} />

      {/* ─── STATS BAR ─── */}
      <section style={{ backgroundColor: "#1C1C1E" }} className="py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.items.map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: "#F2C94C", fontFamily: "Georgia, serif" }}
                >
                  {stat.num}
                </p>
                <p className="text-sm font-body" style={{ color: "rgba(248, 245, 240, 0.6)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      {featured.length > 0 && (
        <section className="py-20" style={{ backgroundColor: "#F8F5F0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-3 font-body"
                  style={{ color: "#A02B2F" }}
                >
                  {featured_c.eyebrow}
                </p>
                <h2
                  className="text-4xl font-bold"
                  style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
                >
                  {featured_c.heading}
                </h2>
              </div>
              <Link
                href="/properties"
                className="flex items-center gap-2 mt-4 md:mt-0 text-sm font-body font-bold link-underline"
                style={{ color: "#A02B2F" }}
              >
                {featured_c.viewAllLabel} <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/*
           * On mobile: the grid has no side padding, cards bleed to screen edge.
           * On md+: restored to the standard max-w container with padding and gap.
           */}
          <div className="max-w-7xl mx-auto">
            <div
              className={[
                "grid",
                // Mobile: single column, no gap (cards stack with a divider-like border)
                "grid-cols-1 gap-px md:gap-8",
                // Restore side padding only on md+; mobile bleeds full width
                "md:px-6",
                featured.length === 1
                  ? "md:grid-cols-1 md:max-w-md md:mx-auto"
                  : featured.length === 2
                  ? "md:grid-cols-2 md:max-w-3xl md:mx-auto"
                  : "md:grid-cols-3",
              ].join(" ")}
              // Thin separator between stacked cards on mobile comes from gap-px + bg
              style={{ backgroundColor: "rgba(160,43,47,0.08)" }}
            >
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── LOCATION SPOTLIGHT ─── */}
      {spotlightCities.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: "#1C1C1E" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3 font-body"
                style={{ color: "#F2C94C" }}
              >
                {locations_c.eyebrow}
              </p>
              <h2
                className="text-4xl font-bold"
                style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
              >
                {locations_c.heading}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {spotlightCities.map((loc) => (
                <Link
                  key={loc.city}
                  href={`/properties?city=${encodeURIComponent(loc.city)}`}
                  className={`relative rounded-xl overflow-hidden group cursor-pointer ${loc.size}`}
                  style={{ minHeight: loc.size.includes("row-span") ? "380px" : "180px" }}
                >
                  {loc.image ? (
                    <Image
                      src={loc.image}
                      alt={loc.city}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0" style={{ backgroundColor: "#2C2C2E" }} />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(28,28,30,0.85) 0%, rgba(28,28,30,0.1) 60%)",
                    }}
                  />
                  <div className="absolute bottom-5 left-5">
                    <h3
                      style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
                      className="text-xl font-bold"
                    >
                      {loc.city}
                    </h3>
                    <p className="text-sm font-body" style={{ color: "#F2C94C" }}>
                      {loc.count} {loc.count === 1 ? "property" : "properties"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── WHY US ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#1C1C1E" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-body"
              style={{ color: "#F2C94C" }}
            >
              {whyus.eyebrow}
            </p>
            <h2
              className="text-4xl font-bold whitespace-pre-line"
              style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
            >
              {whyus.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyus.cards.map(({ icon, title, desc }) => {
              const Icon = ICON_MAP[icon] ?? Shield;
              return (
                <div
                  key={title}
                  className="rounded-xl p-8"
                  style={{
                    backgroundColor: "rgba(248, 245, 240, 0.05)",
                    border: "1px solid rgba(242, 201, 76, 0.15)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                    style={{ backgroundColor: "rgba(160, 43, 47, 0.2)" }}
                  >
                    <Icon size={22} style={{ color: "#F2C94C" }} />
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed font-body"
                    style={{ color: "rgba(248, 245, 240, 0.6)" }}
                  >
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={cta.backgroundImage}
            alt="List your property"
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(28,28,30,0.92) 0%, rgba(160,43,47,0.75) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4 font-body"
            style={{ color: "#F2C94C" }}
          >
            {cta.eyebrow}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 whitespace-pre-line"
            style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
          >
            {cta.heading}
          </h2>
          <p
            className="text-lg mb-10 font-body"
            style={{ color: "rgba(248, 245, 240, 0.7)" }}
          >
            {cta.subheading}
          </p>
          <Link
            href={cta.buttonHref}
            className="inline-flex items-center gap-2 px-10 py-4 rounded text-base font-bold font-body transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #A02B2F, #7E2125)",
              color: "#F8F5F0",
            }}
          >
            {cta.buttonLabel}
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}