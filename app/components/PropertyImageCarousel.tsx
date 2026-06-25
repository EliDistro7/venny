"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

type MediaItem =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string };

interface Props {
  images?: string[];
  videos?: string[];
  title: string;
}

function buildMediaList(images: string[], videos: string[]): MediaItem[] {
  return [
    ...images.map((src): MediaItem => ({ kind: "image", src })),
    ...videos.map((src): MediaItem => ({ kind: "video", src })),
  ];
}

// ------------------------------------------------------------------
// Individual slide renderers
// ------------------------------------------------------------------

function ImageSlide({
  src,
  title,
  priority,
  active,
}: {
  src: string;
  title: string;
  priority: boolean;
  active: boolean;
}) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0 }}
    >
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

function VideoSlide({
  src,
  active,
}: {
  src: string;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      el.currentTime = 0;
      el.play().catch(() => {
        // autoplay blocked — user can tap play
      });
    } else {
      el.pause();
    }
  }, [active]);

  return (
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0 }}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        controls={active}
        style={{ display: "block" }}
      />
    </div>
  );
}

// ------------------------------------------------------------------
// Thumbnail strip
// ------------------------------------------------------------------

function ThumbnailStrip({
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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 px-4 max-w-full overflow-x-auto">
      {media.map((item, i) => {
        const isActive = i === current;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            aria-label={`Go to ${item.kind} ${i + 1}`}
            className="relative flex-shrink-0 rounded overflow-hidden transition-all"
            style={{
              width: isActive ? "64px" : "48px",
              height: "40px",
              outline: isActive ? "2px solid #F2C94C" : "2px solid transparent",
              outlineOffset: "2px",
              opacity: isActive ? 1 : 0.65,
              transition: "width 0.2s ease, opacity 0.2s ease, outline-color 0.2s ease",
            }}
          >
            {item.kind === "image" ? (
              <Image
                src={item.src}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              /* Video thumbnail — dark tile with play icon */
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(28,28,30,0.85)" }}
              >
                <Play size={14} fill="#F2C94C" stroke="none" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------------
// Main carousel
// ------------------------------------------------------------------

export default function PropertyImageCarousel({
  images = [],
  videos = [],
  title,
}: Props) {
  const media = buildMediaList(images, videos);
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((i) => (i === 0 ? media.length - 1 : i - 1));
  const next = () =>
    setCurrent((i) => (i === media.length - 1 ? 0 : i + 1));

  if (media.length === 0) return null;

  // Single item — no controls needed
  if (media.length === 1) {
    const item = media[0];
    return (
      <div className="relative h-[50vh] md:h-[60vh]">
        {item.kind === "image" ? (
          <Image src={item.src} alt={title} fill className="object-cover" priority />
        ) : (
          <video
            src={item.src}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        )}
        {/* gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(28,28,30,0.7) 0%, rgba(28,28,30,0.1) 50%)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {/* Slides */}
      {media.map((item, i) =>
        item.kind === "image" ? (
          <ImageSlide
            key={`img-${i}`}
            src={item.src}
            title={`${title} — image ${i + 1}`}
            priority={i === 0}
            active={i === current}
          />
        ) : (
          <VideoSlide key={`vid-${i}`} src={item.src} active={i === current} />
        )
      )}

      {/* Gradient overlay — sits above slides but below controls */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(28,28,30,0.75) 0%, rgba(28,28,30,0.08) 45%)",
        }}
      />

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full transition-opacity hover:opacity-100"
        style={{ backgroundColor: "rgba(28,28,30,0.6)", color: "#F8F5F0", opacity: 0.85 }}
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full transition-opacity hover:opacity-100"
        style={{ backgroundColor: "rgba(28,28,30,0.6)", color: "#F8F5F0", opacity: 0.85 }}
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Thumbnail strip */}
      <ThumbnailStrip media={media} current={current} onSelect={setCurrent} />

      {/* Counter badge */}
      <div
        className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full text-xs font-body font-bold flex items-center gap-1"
        style={{ backgroundColor: "rgba(28,28,30,0.6)", color: "#F8F5F0" }}
      >
        {/* Show play icon in counter when current slide is a video */}
        {media[current].kind === "video" && (
          <Play size={10} fill="#F2C94C" stroke="none" />
        )}
        {current + 1} / {media.length}
      </div>
    </div>
  );
}