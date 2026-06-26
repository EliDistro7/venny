"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Bed, Bath, Maximize, Video, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  work_in_progress: { label: "Work in Progress", color: "#D9822B" },
  finished: { label: "Finished", color: "#2F855A" },
//  delivered: { label: "Delivered to Customer", color: "#4A5568" },
};

const categoryLabel: Record<string, string> = {
  apartment: "Apartment",
  villa: "Villa",
  house: "House",
  land: "Land",
  commercial: "Commercial",
};

const availabilityConfig: Record<string, { label: string; color: string }> = {
  sold: { label: "Sold", color: "#1C1C1E" },
  rented: { label: "Rented", color: "#1C1C1E" },
  reserved: { label: "Reserved", color: "#D9822B" },
};

type MediaItem =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string };

function buildMedia(images: string[], videos: string[]): MediaItem[] {
  return [
    ...images.map((src): MediaItem => ({ kind: "image", src })),
    ...videos.map((src): MediaItem => ({ kind: "video", src })),
  ];
}

// ── Media thumbnail strip ─────────────────────────────────────────────────────

function MediaStrip({
  media,
  current,
  onSelect,
}: {
  media: MediaItem[];
  current: number;
  onSelect: (i: number) => void;
}) {
  if (media.length <= 1) return null;
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 max-w-[90%] overflow-x-auto px-1">
      {media.map((item, i) => {
        const active = i === current;
        return (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSelect(i);
            }}
            aria-label={`View ${item.kind} ${i + 1}`}
            className="relative flex-shrink-0 rounded overflow-hidden transition-all duration-200"
            style={{
              width: active ? "52px" : "40px",
              height: "32px",
              outline: active ? "2px solid #F2C94C" : "2px solid transparent",
              outlineOffset: "1px",
              opacity: active ? 1 : 0.6,
            }}
          >
            {item.kind === "image" ? (
              <Image src={item.src} alt="" fill className="object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(28,28,30,0.9)" }}
              >
                <Play size={10} fill="#F2C94C" stroke="none" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Active media slide ────────────────────────────────────────────────────────

function MediaSlide({
  item,
  title,
  unavailable,
}: {
  item: MediaItem;
  title: string;
  unavailable: boolean;
}) {
  if (item.kind === "image") {
    return (
      <Image
        src={item.src}
        alt={title}
        fill
        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
          unavailable ? "brightness-75" : ""
        }`}
      />
    );
  }

  // Video — show in natural aspect ratio, letterboxed inside the card frame
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <video
        src={item.src}
        className="max-w-full max-h-full w-auto h-auto"
        style={{ objectFit: "contain" }}
        controls
        playsInline
        preload="metadata"
        onClick={(e) => e.preventDefault()} // prevent card link navigation on click
      />
    </div>
  );
}

// ── Fallback when there are no media at all ───────────────────────────────────

function EmptyMedia() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: "#2C2C2E" }}
    >
      <Video size={32} style={{ color: "rgba(242,201,76,0.4)" }} />
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

export default function PropertyCard({ property }: PropertyCardProps) {
  const isDelivered = property.status === "delivered";
  const unavailable = property.availability && property.availability !== "available";
  const availBadge = unavailable ? availabilityConfig[property.availability!] : null;

  const media = buildMedia(property.images ?? [], property.videos ?? []);
  const hasMedia = media.length > 0;
  const hasVideos = (property.videos?.length ?? 0) > 0;

  const [current, setCurrent] = useState(0);
  const currentItem = media[current] ?? null;
  const isVideo = currentItem?.kind === "video";

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    setCurrent((i) => (i === 0 ? media.length - 1 : i - 1));
  }
  function next(e: React.MouseEvent) {
    e.preventDefault();
    setCurrent((i) => (i === media.length - 1 ? 0 : i + 1));
  }

  return (
    <Link href={`/properties/${property.id}`} className="block group">
      <div
        className="rounded-xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 12px rgba(28, 28, 30, 0.08)",
        }}
      >
        {/* ── Media area ── */}
        <div className="relative h-56 overflow-hidden bg-black">
          {hasMedia ? (
            <MediaSlide
              item={currentItem}
              title={property.title}
              unavailable={!!unavailable}
            />
          ) : (
            <EmptyMedia />
          )}

          {/* Unavailability stamp */}
          {availBadge && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <span
                className="px-5 py-2 rounded text-sm font-bold tracking-widest font-body uppercase rotate-[-15deg]"
                style={{
                  backgroundColor: availBadge.color,
                  color: "#FFFFFF",
                  opacity: 0.92,
                  letterSpacing: "0.15em",
                }}
              >
                {availBadge.label}
              </span>
            </div>
          )}

          {/* Prev / Next arrows — only when multiple media and not on a video (controls handle that) */}
          {media.length > 1 && !isVideo && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "rgba(28,28,30,0.65)", color: "#F8F5F0" }}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "rgba(28,28,30,0.65)", color: "#F8F5F0" }}
              >
                <ChevronRight size={15} />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {!isVideo && (
            <MediaStrip media={media} current={current} onSelect={setCurrent} />
          )}

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap z-10">
            {!isDelivered && (
              <span
                className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body uppercase"
                style={{
                  backgroundColor: property.type === "sale" ? "#A02B2F" : "#1C1C1E",
                  color: "#FFFFFF",
                }}
              >
                {property.type === "sale" ? "For Sale" : "For Rent"}
              </span>
            )}
            <span
              className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body"
              style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#1C1C1E" }}
            >
              {categoryLabel[property.category]}
            </span>
            {property.status && (
              <span
                className="px-3 py-1 rounded text-xs font-bold tracking-wider font-body"
                style={{
                  backgroundColor: statusConfig[property.status].color,
                  color: "#FFFFFF",
                }}
              >
                {statusConfig[property.status].label}
              </span>
            )}
          </div>

          {/* Top-right badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
            {property.featured && (
              <span
                className="px-2 py-1 rounded text-xs font-bold tracking-wider font-body"
                style={{ backgroundColor: "#F2C94C", color: "#1C1C1E" }}
              >
                ✦ Featured
              </span>
            )}
            {hasVideos && (
              <span
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold font-body"
                style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "#FFFFFF" }}
              >
                <Video size={11} />
                Video
              </span>
            )}
          </div>

          {/* Media counter */}
          {media.length > 1 && (
            <div
              className="absolute bottom-2 right-3 z-20 px-2 py-0.5 rounded-full text-xs font-body font-bold"
              style={{ backgroundColor: "rgba(28,28,30,0.6)", color: "#F8F5F0" }}
            >
              {current + 1}/{media.length}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="p-5">
          <p
            className="text-sm font-bold mb-1 font-body uppercase tracking-wide"
            style={{ color: "#A02B2F" }}
          >
            {isDelivered ? (
              <></>
            ) : property.type === "sale" ? (
              "For Sale — Contact for Price"
            ) : (
              "For Rent — Contact for Price"
            )}
          </p>

          <h3
            className="text-base font-bold mb-2 leading-snug"
            style={{ color: "#1C1C1E", fontFamily: "Georgia, serif" }}
          >
            {property.title}
          </h3>

          <div className="flex items-center gap-1 mb-4">
            <MapPin size={13} style={{ color: "#A02B2F", flexShrink: 0 }} />
            <span className="text-xs font-body" style={{ color: "#6B6558" }}>
              {property.location}
            </span>
          </div>

          {property.category !== "land" ? (
            <div
              className="flex gap-4 pt-4 font-body text-xs"
              style={{
                borderTop: "1px solid rgba(160, 43, 47, 0.12)",
                color: "#6B6558",
              }}
            >
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bed size={13} />
                  {property.bedrooms} Bed{property.bedrooms !== 1 ? "s" : ""}
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath size={13} />
                  {property.bathrooms} Bath{property.bathrooms !== 1 ? "s" : ""}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Maximize size={13} />
                {property.area.toLocaleString()} m²
              </span>
            </div>
          ) : (
            <div
              className="pt-4 font-body text-xs"
              style={{
                borderTop: "1px solid rgba(160, 43, 47, 0.12)",
                color: "#6B6558",
              }}
            >
              <span className="flex items-center gap-1">
                <Maximize size={13} />
                {property.area.toLocaleString()} m² plot
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}