"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthToken } from "@/lib/adminApi";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === "/admin/dashboard";

  function handleLogout() {
    clearAuthToken();
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 shrink-0 bg-charcoal-roof min-h-screen flex flex-col">
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

      <nav className="flex-1 px-4 py-6">
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
      </nav>

      <div className="px-4 py-6 border-t border-mist/10">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-md font-body text-sm text-stone-grey hover:bg-brick-red/10 hover:text-brick-red transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}