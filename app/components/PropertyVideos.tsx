// app/components/PropertyVideos.tsx
"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export default function PropertyVideos({ videos }: { videos: string[] }) {
  const [active, setActive] = useState(0);

  if (!videos.length) return null;

  return (
    <div>
      {/* Main player */}
      <video
        key={videos[active]}
        controls
        className="w-full rounded-xl"
        style={{ maxHeight: "480px", backgroundColor: "#000" }}
      >
        <source src={videos[active]} />
        Your browser does not support video playback.
      </video>

      {/* Thumbnails — only show if more than one video */}
      {videos.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
          {videos.map((url, i) => (
            <button
              key={url}
              onClick={() => setActive(i)}
              className="relative flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden"
              style={{
                outline: i === active ? "2px solid #A02B2F" : "2px solid transparent",
              }}
            >
              <video src={url} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
                <Play size={18} fill="#fff" color="#fff" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}