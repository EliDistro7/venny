import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Share2, Camera, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#1C1C1E", color: "rgba(248, 245, 240, 0.8)" }}
      className="pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-9 w-9 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Venny Construction & Real Estate Co. Ltd."
                  fill
                  className="object-contain"
                />
              </div>
              <span
                style={{ fontFamily: "Georgia, serif", color: "#F8F5F0" }}
                className="text-lg font-bold"
              >
                Venny <span style={{ color: "#F2C94C" }}>Construction</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed font-body mb-6">
              Venny Construction &amp; Real Estate Co. Ltd. — Maisha Ni Nyumba Bora.
              Connecting buyers, sellers, and renters with exceptional properties
              across Tanzania.
            </p>
            <div className="flex gap-4">
              {[Share2, Camera, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: "rgba(160, 43, 47, 0.2)", color: "#F2C94C" }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{ color: "#F2C94C", fontFamily: "Georgia, serif" }}
              className="text-sm font-bold tracking-widest uppercase mb-5"
            >
              Navigate
            </h4>
            <ul className="space-y-3 font-body text-sm">
              {[
                { label: "Buy Property", href: "/properties?type=sale" },
                { label: "Rent Property", href: "/properties?type=rent" },
                { label: "List Your Property", href: "/contact" },
                { label: "About Venny Construction", href: "/about" },
                { label: "Meet Our Agents", href: "/about#agents" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline transition-colors hover:text-amber-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4
              style={{ color: "#F2C94C", fontFamily: "Georgia, serif" }}
              className="text-sm font-bold tracking-widest uppercase mb-5"
            >
              Cities
            </h4>
            <ul className="space-y-3 font-body text-sm">
              {["CBD", "Chamwino", "Kongwa", "Mpwapwa", "Bahi", "Chemba", "Kondoa"].map((city) => (
                <li key={city}>
                  <Link
                    href={`/properties?city=${encodeURIComponent(city)}`}
                    className="link-underline transition-colors hover:text-amber-300"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{ color: "#F2C94C", fontFamily: "Georgia, serif" }}
              className="text-sm font-bold tracking-widest uppercase mb-5"
            >
              Contact
            </h4>
            <ul className="space-y-4 font-body text-sm">
              <li className="flex gap-3">
                <MapPin size={15} style={{ color: "#F2C94C", flexShrink: 0, marginTop: 2 }} />
                <span>Haile Selassie Road, Masaki, Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex gap-3">
                <Phone size={15} style={{ color: "#F2C94C", flexShrink: 0, marginTop: 2 }} />
                <span>+255 657 510 444</span>
              </li>
              <li className="flex gap-3">
                <Mail size={15} style={{ color: "#F2C94C", flexShrink: 0, marginTop: 2 }} />
                <span>Vennycompany762@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-body"
          style={{ borderTop: "1px solid rgba(242, 201, 76, 0.15)", color: "rgba(248, 245, 240, 0.5)" }}
        >
          <p>© 2026 Venny Construction &amp; Real Estate Co. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-amber-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}