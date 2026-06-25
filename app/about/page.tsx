
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, Heart, ChevronRight } from "lucide-react";


export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "#F8F5F0" }}>
      {/* Hero */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1577086664693-894d8405334a?w=1600&q=80"
          alt="Tanzania coastline"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(28,28,30,0.92) 0%, rgba(160,43,47,0.7) 100%)",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-4 font-body" style={{ color: "#F2C94C" }}>
            Our Story
          </p>
          <h1 className="text-4xl md:text-6xl font-bold" style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}>
            About Venny Construction
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg leading-relaxed font-body mb-6" style={{ color: "#4A4437" }}>
            Founded in Dar es Salaam, Venny Construction &amp; Real Estate Co.
            Ltd. has grown from a small local agency into one of
            Tanzania&apos;s most trusted construction and real estate
            companies. We believe everyone deserves access to clear, honest
            guidance when making one of life&apos;s biggest decisions —
            finding a place to call home. Maisha Ni Nyumba Bora.
          </p>
          <p className="text-lg leading-relaxed font-body" style={{ color: "#4A4437" }}>
            Today, our network spans Dar es Salaam, Zanzibar, Arusha, Mwanza,
            and Dodoma, connecting local families, the Tanzanian diaspora, and
            international investors with verified properties across the
            country.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-6" style={{ backgroundColor: "#1C1C1E" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              Icon: Target,
              title: "Our Mission",
              desc: "To make property and construction services in Tanzania transparent, accessible, and secure for everyone — from first-time buyers to seasoned investors.",
            },
            {
              Icon: Eye,
              title: "Our Vision",
              desc: "A Tanzania where every citizen and investor can find verified, fairly priced property information in one trusted place.",
            },
            {
              Icon: Heart,
              title: "Our Values",
              desc: "Integrity, local expertise, and genuine care for our clients guide every listing we publish and every deal we facilitate.",
            },
          ].map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-8 text-center"
              style={{ backgroundColor: "rgba(248, 245, 240, 0.05)", border: "1px solid rgba(242, 201, 76, 0.15)" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: "rgba(160, 43, 47, 0.2)" }}
              >
                <Icon size={24} style={{ color: "#F2C94C" }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed font-body" style={{ color: "rgba(248, 245, 240, 0.6)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

     

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "#FFFFFF" }}>
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}>
          Ready to find your home?
        </h2>
        <p className="font-body mb-8" style={{ color: "#6B6558" }}>
          Browse our listings or get in touch with our team today.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 px-8 py-3 rounded font-bold text-sm font-body"
          style={{ background: "linear-gradient(135deg, #A02B2F, #7E2125)", color: "#F8F5F0" }}
        >
          Browse Properties <ChevronRight size={16} />
        </Link>
      </section>
    </main>
  );
}
