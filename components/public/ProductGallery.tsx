"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  imageUrl: string;
  altText?: string | null;
  isPrimary: boolean;
}

interface Props {
  images: GalleryImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const sorted = [...images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (sorted.length === 0) {
    return (
      <div className="aspect-square bg-[#f5f0e8] flex items-center justify-center text-[#e0d9cc] text-xs uppercase tracking-widest">
        No Image
      </div>
    );
  }

  const active = sorted[activeIdx];

  function prev() { setActiveIdx((i) => (i - 1 + sorted.length) % sorted.length); }
  function next() { setActiveIdx((i) => (i + 1) % sorted.length); }

  return (
    <div className="flex gap-4">
      {/* Thumbnails — vertical strip */}
      {sorted.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 w-16 shrink-0">
          {sorted.map((img, i) => (
            <button
              key={img.imageUrl + i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "relative aspect-square border-2 overflow-hidden transition-colors",
                activeIdx === i ? "border-[#b5964e]" : "border-[#e0d9cc] hover:border-[#b5964e]"
              )}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText ?? productName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 min-w-0">
        <div
          className="relative aspect-square bg-[#f5f0e8] overflow-hidden group cursor-zoom-in"
          onClick={() => setZoomed(true)}
        >
          <Image
            src={active.imageUrl}
            alt={active.altText ?? productName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <button className="absolute top-3 right-3 bg-white/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} className="text-[#1a1a1a]" />
          </button>
          {/* Prev/Next arrows */}
          {sorted.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} className="text-[#1a1a1a]" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight size={18} className="text-[#1a1a1a]" />
              </button>
            </>
          )}
        </div>

        {/* Mobile thumbnail dots */}
        {sorted.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3 md:hidden">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={cn("w-1.5 h-1.5 rounded-full transition-colors", activeIdx === i ? "bg-[#b5964e]" : "bg-[#e0d9cc]")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox zoom */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] aspect-square">
            <Image
              src={active.imageUrl}
              alt={active.altText ?? productName}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          {sorted.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 text-white hover:bg-white/40">
                <ChevronLeft size={24} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 text-white hover:bg-white/40">
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
