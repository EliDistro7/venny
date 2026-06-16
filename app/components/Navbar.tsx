"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      style={{
        backgroundColor: scrolled ? "rgba(28, 28, 30, 0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(242, 201, 76, 0.2)" : "none",
        transition: "all 0.4s ease",
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 md:h-14 md:w-14 shrink-0">
            <Image
              src="/logo.png"
              alt="Venny Construction & Real Estate Co. Ltd."
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span
              style={{ color: "#A02B2F", fontFamily: "Georgia, serif" }}
              className="text-lg font-bold tracking-wide"
            >
              Venny
            </span>
            <span
              style={{ color: "#F2C94C" }}
              className="text-[10px] font-bold tracking-widest uppercase"
            >
              Construction &amp; Real Estate
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline font-body text-sm tracking-wider"
              style={{ color: "rgba(248, 245, 240, 0.9)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          
          <a  href="tel:+255712345678"
            className="flex items-center gap-2 text-sm font-body"
            style={{ color: "#F2C94C" }}
          >
            <Phone size={14} />
            <span>+255 712 345 678</span>
          </a>
          <Link
            href="/contact"
            className="px-5 py-2 rounded text-sm font-bold tracking-wide transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #A02B2F, #7E2125)",
              color: "#F8F5F0",
              fontFamily: "-apple-system, sans-serif",
            }}
          >
            List Property
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          style={{ color: "#F2C94C" }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            backgroundColor: "#1C1C1E",
            borderTop: "1px solid rgba(242, 201, 76, 0.2)",
          }}
          className="md:hidden px-6 py-6 flex flex-col gap-6"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base font-body tracking-wider"
              style={{ color: "rgba(248, 245, 240, 0.9)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="text-center px-5 py-3 rounded font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #A02B2F, #7E2125)",
              color: "#F8F5F0",
            }}
          >
            List Property
          </Link>
        </div>
      )}
    </nav>
  );
}