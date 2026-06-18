"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "255657510444";
const WHATSAPP_MESSAGE = "Hello! Nahitaji huduma zenu.";

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
      style={{
        backgroundColor: "#25D366",
        color: "#FFFFFF",
        boxShadow: "0 4px 24px rgba(37, 211, 102, 0.4)",
      }}
    >
      <MessageCircle size={22} strokeWidth={2} />
      <span
        className="text-sm font-bold font-body overflow-hidden transition-all duration-300 whitespace-nowrap"
        style={{ maxWidth: "0px" }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.maxWidth = "120px")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.maxWidth = "0px")}
      >
        Chat with us
      </span>
    </a>
  );
}