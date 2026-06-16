import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 pt-20"
      style={{ backgroundColor: "#F8F5F0" }}
    >
      <div className="text-center">
        <p
          className="text-7xl font-bold mb-4"
          style={{ color: "#C8953A", fontFamily: "Georgia, serif" }}
        >
          404
        </p>
        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: "#0B3D4E", fontFamily: "Georgia, serif" }}
        >
          Property Not Found
        </h1>
        <p className="font-body mb-8" style={{ color: "#6B6558" }}>
          This listing may have been sold, rented, or removed.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 px-6 py-3 rounded font-bold text-sm font-body"
          style={{ background: "linear-gradient(135deg, #C8953A, #E8B85A)", color: "#0B3D4E" }}
        >
          <Home size={16} />
          Browse Properties
        </Link>
      </div>
    </main>
  );
}
