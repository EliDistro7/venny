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
                { Icon: MapPin, label: "Address", value: "Haile Selassie Road, Masaki, Dar es Salaam, Tanzania" },
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

            {/* Map placeholder */}
            <div
              className="rounded-xl h-64 flex items-center justify-center"
              style={{ backgroundColor: "#1C1C1E" }}
            >
              <div className="text-center px-6">
                <MapPin size={32} style={{ color: "#F2C94C", margin: "0 auto 12px" }} />
                <p className="font-body text-sm" style={{ color: "rgba(248,245,240,0.7)" }}>
                  Masaki Peninsula, Dar es Salaam
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <div
              className="rounded-xl p-8"
              style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(28,28,30,0.08)" }}
            >
              {submitted ? (
                <div className="text-center py-10">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: "rgba(160, 43, 47, 0.15)" }}
                  >
                    <Send size={24} style={{ color: "#A02B2F" }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}>
                    Message Sent!
                  </h3>
                  <p className="font-body text-sm" style={{ color: "#6B6558" }}>
                    Thank you for reaching out. Our team will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}>
                    Send a Message
                  </h2>
                  <div>
                    <label className="block text-xs font-bold tracking-wider uppercase mb-2 font-body" style={{ color: "#6B6558" }}>
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded font-body text-sm outline-none"
                      style={{ backgroundColor: "#F8F5F0", border: "1px solid rgba(242,201,76,0.3)", color: "#1C1C1E" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-wider uppercase mb-2 font-body" style={{ color: "#6B6558" }}>
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded font-body text-sm outline-none"
                        style={{ backgroundColor: "#F8F5F0", border: "1px solid rgba(242,201,76,0.3)", color: "#1C1C1E" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider uppercase mb-2 font-body" style={{ color: "#6B6558" }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+255..."
                        className="w-full px-4 py-3 rounded font-body text-sm outline-none"
                        style={{ backgroundColor: "#F8F5F0", border: "1px solid rgba(242,201,76,0.3)", color: "#1C1C1E" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider uppercase mb-2 font-body" style={{ color: "#6B6558" }}>
                      I&apos;m interested in
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded font-body text-sm outline-none"
                      style={{ backgroundColor: "#F8F5F0", border: "1px solid rgba(242,201,76,0.3)", color: "#1C1C1E" }}
                    >
                      <option>Buying a property</option>
                      <option>Renting a property</option>
                      <option>Listing my property</option>
                      <option>General enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider uppercase mb-2 font-body" style={{ color: "#6B6558" }}>
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us what you're looking for..."
                      className="w-full px-4 py-3 rounded font-body text-sm outline-none resize-none"
                      style={{ backgroundColor: "#F8F5F0", border: "1px solid rgba(242,201,76,0.3)", color: "#1C1C1E" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded font-bold text-sm font-body"
                    style={{ background: "linear-gradient(135deg, #A02B2F, #7E2125)", color: "#F8F5F0" }}
                  >
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}