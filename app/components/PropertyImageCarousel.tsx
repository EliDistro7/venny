"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function PropertyImageCarousel({ images, title }: Props) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className="relative h-[50vh] md:h-[60vh]">
        <Image src={images[0]} alt={title} fill className="object-cover" priority />
      </div>
    );
  }

  return (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {/* Slides */}
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image src={src} alt={`${title} — image ${i + 1}`} fill className="object-cover" priority={i === 0} />
        </div>
      ))}

      {/* Gradient overlay (always on top of slides) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(28,28,30,0.7) 0%, rgba(28,28,30,0.1) 50%)",
        }}
      />

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full transition-all"
        style={{ backgroundColor: "rgba(28,28,30,0.6)", color: "#F8F5F0" }}
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full transition-all"
        style={{ backgroundColor: "rgba(28,28,30,0.6)", color: "#F8F5F0" }}
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              backgroundColor: i === current ? "#F2C94C" : "rgba(248,245,240,0.5)",
            }}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div
        className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full text-xs font-body font-bold"
        style={{ backgroundColor: "rgba(28,28,30,0.6)", color: "#F8F5F0" }}
      >
        {current + 1} / {images.length}
      </div>
    </div>
  );
}