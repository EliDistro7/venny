"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

type MediaItem =
  | { kind: "image"; src: string; width?: number; height?: number }
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
// Image slide — uses a native <img> so the browser respects natural size
// We cap width at 100% and let height scale proportionally.
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
      className="w-full transition-opacity duration-500"
      style={{
        display: active ? "block" : "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          maxHeight: "90vh",
          objectFit: "contain",
          backgroundColor: "#1C1C1E",
        }}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}

// ------------------------------------------------------------------
// Video slide — lets the video define its own aspect ratio
// ------------------------------------------------------------------

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
      style={{
        display: active ? "block" : "none",
        width: "100%",
        backgroundColor: "#1C1C1E",
      }}
    >
      <video
        ref={videoRef}
        src={src}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          maxHeight: "90vh",
          objectFit: "contain",
        }}
        loop
        muted
        playsInline
        controls={active}
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
    <div
      className="flex gap-2 px-4 py-3 justify-center flex-wrap"
      style={{ backgroundColor: "rgba(28,28,30,0.92)" }}
    >
      {media.map((item, i) => {
        const isActive = i === current;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            aria-label={`Go to ${item.kind} ${i + 1}`}
            className="relative flex-shrink-0 rounded overflow-hidden transition-all"
            style={{
              width: isActive ? 64 : 48,
              height: 40,
              outline: isActive ? "2px solid #F2C94C" : "2px solid transparent",
              outlineOffset: "2px",
              opacity: isActive ? 1 : 0.6,
              transition: "width 0.2s ease, opacity 0.2s ease, outline-color 0.2s ease",
            }}
          >
            {item.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={`Thumbnail ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
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

  const prev = useCallback(
    () => setCurrent((i) => (i === 0 ? media.length - 1 : i - 1)),
    [media.length]
  );
  const next = useCallback(
    () => setCurrent((i) => (i === media.length - 1 ? 0 : i + 1)),
    [media.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (media.length === 0) return null;

  // Single item — no controls
  if (media.length === 1) {
    const item = media[0];
    return (
      <div style={{ backgroundColor: "#1C1C1E", width: "100%" }}>
        {item.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={title}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
              margin: "0 auto",
            }}
          />
        ) : (
          <video
            src={item.src}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#1C1C1E", width: "100%" }}>
      {/* Slides wrapper — position relative for nav button positioning */}
      <div className="relative">
        {/* All slides stacked; only active one is shown via display:block/none */}
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

        {/* Prev / Next — positioned over the current slide */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          style={{
            width: 40,
            height: 40,
            backgroundColor: "rgba(28,28,30,0.65)",
            color: "#F8F5F0",
            opacity: 0.85,
          }}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          style={{
            width: 40,
            height: 40,
            backgroundColor: "rgba(28,28,30,0.65)",
            color: "#F8F5F0",
            opacity: 0.85,
          }}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>

        {/* Counter badge — top-right */}
        <div
          className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-body font-bold flex items-center gap-1"
          style={{ backgroundColor: "rgba(28,28,30,0.65)", color: "#F8F5F0" }}
        >
          {media[current].kind === "video" && (
            <Play size={10} fill="#F2C94C" stroke="none" />
          )}
          {current + 1} / {media.length}
        </div>
      </div>

      {/* Thumbnail strip lives below the slide, not overlaid on it */}
      <ThumbnailStrip media={media} current={current} onSelect={setCurrent} />
    </div>
  );
}