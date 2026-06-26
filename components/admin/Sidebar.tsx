"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { clearAuthToken } from "@/lib/adminApi";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = pathname === "/admin/dashboard";

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleLogout() {
    clearAuthToken();
    router.push("/admin/login");
  }

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-6 py-6 border-b border-mist/10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="/logo.png"
              alt="Venny Construction & Real Estate Co. Ltd."
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-window-gold leading-tight">
              Venny Construction
            </p>
            <p className="font-body text-[10px] text-mist/60 leading-tight">
              & Real Estate Co. Ltd.
            </p>
          </div>
        </div>
        <p className="font-body text-[10px] italic text-stone-grey/60 mt-3">
          Maisha Ni Nyumba Bora
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-md font-body text-sm text-stone-grey hover:bg-mist/5 hover:text-mist transition-colors mb-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 shrink-0"
            aria-hidden="true"
          >
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5 10v9.5a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
          </svg>
          Back to Website
        </Link>

        <div className="my-3 border-t border-mist/10" aria-hidden="true" />

        <Link
          href="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-md font-body text-sm transition-colors ${
            isActive
              ? "bg-mist/10 text-window-gold"
              : "text-stone-grey hover:bg-mist/5 hover:text-mist"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-window-gold" : "bg-stone-grey/50"}`}
            aria-hidden="true"
          />
          Properties
        </Link>


          <div className="my-3 border-t border-mist/10" aria-hidden="true" />

        <Link
          href="/admin/dashboard/home-editor"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-md font-body text-sm transition-colors ${
            isActive
              ? "bg-mist/10 text-window-gold"
              : "text-stone-grey hover:bg-mist/5 hover:text-mist"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-window-gold" : "bg-stone-grey/50"}`}
            aria-hidden="true"
          />
          Edit Homepage
        </Link>
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-mist/10">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-md font-body text-sm text-stone-grey hover:bg-brick-red/10 hover:text-brick-red transition-colors"
        >
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-charcoal-roof min-h-screen flex-col">
        {sidebarContent}
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-charcoal-roof flex items-center justify-between px-4 py-3 border-b border-mist/10">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src="/logo.png"
              alt="Venny Construction & Real Estate Co. Ltd."
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-window-gold">
            Venny Construction
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex flex-col justify-center gap-1.5 w-8 h-8 items-center"
        >
          <span className="block w-5 h-px bg-mist" />
          <span className="block w-5 h-px bg-mist" />
          <span className="block w-5 h-px bg-mist" />
        </button>
      </header>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-72 max-w-[85vw] bg-charcoal-roof h-full flex flex-col shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 text-stone-grey hover:text-mist transition-colors text-xl leading-none"
            >
              ×
            </button>

            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}