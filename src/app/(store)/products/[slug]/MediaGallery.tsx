"use client";
import { useState } from "react";
import Image from "next/image";

type MediaItem = {
  id: number;
  publicId: string;
  type: string;
  sortOrder: number;
};

export default function ProductMediaGallery({
  media,
  productName,
  cloudName,
}: {
  media: MediaItem[];
  productName: string;
  cloudName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex];

  function imageUrl(publicId: string, size = 900) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},h_${size},c_pad,f_auto,q_auto/${publicId}`;
  }

  function thumbUrl(item: MediaItem) {
    if (item.type === "video") {
      return `https://res.cloudinary.com/${cloudName}/video/upload/w_200,h_200,c_fill,so_0/${item.publicId}.jpg`;
    }
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_200,c_pad,f_auto,q_auto/${item.publicId}`;
  }

  function videoUrl(publicId: string) {
    return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto/${publicId}`;
  }

  if (media.length === 0) {
    return (
      <div className="aspect-square bg-white border border-border rounded-2xl flex items-center justify-center text-text-muted">
        <span className="text-4xl opacity-30">📷</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main viewer */}
      <div className="aspect-square relative bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        {active?.type === "video" ? (
          <video
            key={active.publicId}
            src={videoUrl(active.publicId)}
            controls
            autoPlay={false}
            className="absolute inset-0 w-full h-full object-contain"
            poster={`https://res.cloudinary.com/${cloudName}/video/upload/w_900,h_900,c_pad,so_0/${active.publicId}.jpg`}
          />
        ) : active ? (
          <Image
            key={active.publicId}
            src={imageUrl(active.publicId)}
            alt={productName}
            fill
            className="object-contain p-4"
            priority={activeIndex === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : null}

        {/* Video badge */}
        {active?.type === "video" && (
          <div className="absolute top-3 left-3 z-10 bg-navy/80 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none">
            ▶ VIDEO
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? "border-gold shadow-md scale-105"
                  : "border-border hover:border-navy/40"
              }`}
              aria-label={`View media ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbUrl(item)}
                alt={`${productName} ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-white text-base">▶</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
