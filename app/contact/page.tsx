"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ backgroundColor: "#F8F5F0" }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: "#1C1C1E" }} className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3 font-body" style={{ color: "#F2C94C" }}>
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "#F8F5F0", fontFamily: "Georgia, serif" }}>
            Contact Venny Construction
          </h1>
          <p className="mt-3 font-body" style={{ color: "rgba(248, 245, 240, 0.6)" }}>
            We&apos;d love to help you find or list your next property.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}>
              Visit Our Office
            </h2>
            <div className="space-y-6 mb-10">
              {[
                { Icon: MapPin, label: "Address", value: "Mbeya street, Uhindini Dodoma" },
                { Icon: Phone, label: "Phone", value: "+255 657 510 444" },
                { Icon: Mail, label: "Email", value: "Vennycompany762@gmail.com" },
                { Icon: Clock, label: "Office Hours", value: "Mon – Sat: 8:00 AM – 6:00 PM (EAT)" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(160, 43, 47, 0.12)" }}
                  >
                    <Icon size={18} style={{ color: "#A02B2F" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider uppercase font-body mb-1" style={{ color: "#6B6558" }}>
                      {label}
                    </p>
                    <p className="font-body text-sm" style={{ color: "#1C1C1E" }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          
          </div>

          {/* Form */}
          
        </div>
      </div>
    </main>
  );
}