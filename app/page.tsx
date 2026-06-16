import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, TrendingUp, Shield, Users, ChevronRight, Star } from "lucide-react";
import PropertyCard from "./components/PropertyCard";
import { properties, testimonials } from "./data/properties";

export default function Home() {
  const featured = properties.filter((p) => p.featured).slice(0, 3);

  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/featured/f7.jpeg"
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

        <div className="absolute top-32 right-8 md:right-16 text-right z-10 hidden md:block">
          <p
            style={{ color: "rgba(160, 43, 47, 0.4)", fontFamily: "Georgia, serif" }}
            className="text-6xl font-bold leading-none select-none"
          >
            Nyumba
          </p>
          <p
            style={{ color: "rgba(160, 43, 47, 0.2)", fontFamily: "Georgia, serif" }}
            className="text-3xl font-light select-none mt-1"
          >
            Bora
          </p>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-6 font-body"
            style={{ color: "#F2C94C" }}
          >
            Venny Construction &amp; Real Estate Co. Ltd.
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6"
            style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
          >
            Maisha Ni
            <br />
            <span style={{ color: "#F2C94C" }}>Nyumba Bora</span>
            <br />
            in Tanzania
          </h1>
          <p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-body leading-relaxed"
            style={{ color: "rgba(248, 245, 240, 0.75)" }}
          >
            From oceanfront villas in Zanzibar to city apartments in Dar es
            Salaam — discover exceptional properties built and trusted by Venny
            Construction &amp; Real Estate.
          </p>

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
                placeholder="Search by city or neighbourhood..."
                className="flex-1 outline-none bg-transparent font-body text-sm"
                style={{ color: "#1C1C1E" }}
              />
            </div>
            <Link
              href="/properties"
              className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-sm font-body transition-all"
              style={{
                background: "linear-gradient(135deg, #A02B2F, #7E2125)",
                color: "#F8F5F0",
              }}
            >
              <Search size={16} />
              Search
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {["Dar es Salaam", "Zanzibar", "Arusha", "Mwanza"].map((city) => (
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
          <div
            className="w-px h-12 animate-pulse"
            style={{ backgroundColor: "rgba(242, 201, 76, 0.5)" }}
          />
          <p className="text-xs font-body tracking-widest" style={{ color: "rgba(242,201,76,0.6)" }}>
            SCROLL
          </p>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{ backgroundColor: "#1C1C1E" }} className="py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "1,200+", label: "Properties Listed" },
              { num: "850+", label: "Happy Clients" },
              { num: "6", label: "Cities Covered" },
              { num: "15+", label: "Years Experience" },
            ].map((stat) => (
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
      <section className="py-20 px-6" style={{ backgroundColor: "#F8F5F0" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3 font-body"
                style={{ color: "#A02B2F" }}
              >
                Handpicked for You
              </p>
              <h2
                className="text-4xl font-bold"
                style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
              >
                Featured Properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="flex items-center gap-2 mt-4 md:mt-0 text-sm font-body font-bold link-underline"
              style={{ color: "#A02B2F" }}
            >
              View All Properties <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCATION SPOTLIGHT ─── */}
      <section className="py-20 px-6" >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-body"
              style={{ color: "#A02B2F" }}
            >
              Explore Tanzania
            </p>
            <h2
              className="text-4xl font-bold"
              style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
            >
              Properties by Destination
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                city: "Dar es Salaam",
                count: 420,
                img: "/featured/f4.jpeg",
                size: "md:col-span-2 md:row-span-2",
              },
              {
                city: "Zanzibar",
                count: 185,
                img: "/featured/f11.jpeg",
                size: "",
              },
              {
                city: "Arusha",
                count: 97,
                img: "/featured/f13.jpeg",
                size: "",
              },
              {
                city: "Mwanza",
                count: 63,
                img: "/featured/f10.jpeg",
                size: "",
              },
              {
                city: "Dodoma",
                count: 44,
                img: "/featured/f9.jpeg",
                size: "",
              },
            ].map((loc) => (
              <Link
                key={loc.city}
                href={`/properties?city=${encodeURIComponent(loc.city)}`}
                className={`relative rounded-xl overflow-hidden group cursor-pointer ${loc.size}`}
                style={{ minHeight: loc.size.includes("row-span") ? "380px" : "180px" }}
              >
                <Image
                  src={loc.img}
                  alt={loc.city}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
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
                    {loc.count} properties
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#1C1C1E" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-body"
              style={{ color: "#F2C94C" }}
            >
              Why Venny Construction
            </p>
            <h2
              className="text-4xl font-bold"
              style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
            >
              The Trusted Way to
              <br />
              Buy &amp; Sell in Tanzania
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: Shield,
                title: "Verified Listings",
                desc: "Every property is physically inspected and legally verified before appearing on our platform. No surprises.",
              },
              {
                Icon: Users,
                title: "Expert Local Agents",
                desc: "Our bilingual agents (Swahili & English) understand Tanzania's property market better than anyone.",
              },
              {
                Icon: TrendingUp,
                title: "Market Intelligence",
                desc: "Access real price data, neighbourhood insights, and investment analysis to make confident decisions.",
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl p-8"
                style={{ backgroundColor: "rgba(248, 245, 240, 0.05)", border: "1px solid rgba(242, 201, 76, 0.15)" }}
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
                <p className="text-sm leading-relaxed font-body" style={{ color: "rgba(248, 245, 240, 0.6)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

 

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-body"
              style={{ color: "#A02B2F" }}
            >
              Client Stories
            </p>
            <h2
              className="text-4xl font-bold"
              style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
            >
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-xl p-7"
                style={{
                  backgroundColor: "#F8F5F0",
                  border: "1px solid rgba(160, 43, 47, 0.12)",
                }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      style={{ fill: "#F2C94C", color: "#F2C94C" }}
                    />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-5 font-body"
                  style={{ color: "#4A4437" }}
                >
                  &ldquo;{t.message}&rdquo;
                </p>
                <div>
                  <p
                    className="font-bold text-sm"
                    style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
                  >
                    {t.name}
                  </p>
                  <p className="text-xs font-body" style={{ color: "#A02B2F" }}>
                    {t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80"
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
            Own Property in Tanzania?
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}
          >
            List With Venny
            <br />
            &amp; Reach Thousands
          </h2>
          <p
            className="text-lg mb-10 font-body"
            style={{ color: "rgba(248, 245, 240, 0.7)" }}
          >
            Connect with verified buyers and renters across Tanzania and the
            diaspora. Free listing for first 30 days.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 rounded text-base font-bold font-body transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #A02B2F, #7E2125)",
              color: "#F8F5F0"
            }}
          >
            List Your Property Free
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}