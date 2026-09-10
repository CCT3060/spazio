"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  buttonText: string | null;
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const go = useCallback(
    (idx: number) => {
      if (transitioning || idx === current) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((idx + slides.length) % slides.length);
        setTransitioning(false);
      }, 300);
    },
    [current, slides.length, transitioning]
  );

  // Auto-advance every 6s
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => go((current + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [current, go, slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[current];

  return (
    <div className="relative w-full h-screen min-h-[600px] -mt-16 bg-[#1a1a1a] overflow-hidden">
      {/* Background image */}
      <div className={cn("absolute inset-0 transition-opacity duration-300", transitioning ? "opacity-0" : "opacity-100")}>
        <Image
          src={slide.imageUrl}
          alt={slide.title ?? ""}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Content */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-300",
          transitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="max-w-2xl">
          {slide.subtitle && (
            <p className="text-white/70 text-xs uppercase tracking-[0.3em] mb-4">
              {slide.subtitle}
            </p>
          )}
          {slide.title && (
            <h2
              className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-8"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {slide.title}
            </h2>
          )}
          {slide.linkUrl && slide.buttonText && (
            <Link
              href={slide.linkUrl}
              className="inline-block border border-white text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-[#1a1a1a] transition-colors"
            >
              {slide.buttonText}
            </Link>
          )}
        </div>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(current - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => go(current + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={cn(
                  "w-8 h-0.5 transition-colors",
                  i === current ? "bg-white" : "bg-white/40 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
