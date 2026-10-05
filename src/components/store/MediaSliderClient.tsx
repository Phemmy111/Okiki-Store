"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { buildCloudinaryUrl } from "@/lib/cloudinary-client";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Slide = {
  id: number;
  mediaType: string;
  publicId: string;
  posterPublicId: string | null;
  altText: string | null;
  headline: string | null;
  subtext: string | null;
  btnLabel: string | null;
  btnUrl: string | null;
  transitionOverride: string | null;
  durationOverrideMs: number | null;
};

type MediaSlot = {
  id: number;
  slug: string;
  label: string;
  layout: string;
  defaultTransition: string;
  defaultDurationMs: number;
  autoplay: boolean;
  showControls: boolean;
  slides: Slide[];
};

export default function MediaSliderClient({ data }: { data: MediaSlot }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(data.autoplay);
  
  const slides = data.slides;
  const layout = data.layout as "hero" | "banner" | "tile" | "card";
  const currentSlide = slides[currentIndex];
  
  const duration = currentSlide.durationOverrideMs || data.defaultDurationMs;
  const transitionType = currentSlide.transitionOverride || data.defaultTransition;

  // Auto-advance
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, duration, slides.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // Transitions setup
  const variants = {
    fade: {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      enter: { x: "100%", opacity: 0 },
      center: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 0 }
    },
    zoom: { // Ken Burns style
      enter: { scale: 1.1, opacity: 0 },
      center: { scale: 1, opacity: 1 },
      exit: { scale: 1.1, opacity: 0 }
    },
    parallax: {
      enter: { x: "50%", opacity: 0 },
      center: { x: 0, opacity: 1 },
      exit: { x: "-20%", opacity: 0 }
    }
  };

  const currentVariants = variants[transitionType as keyof typeof variants] || variants.fade;
  
  // Height based on layout
  const containerClasses = {
    hero: "aspect-[16/9] md:aspect-[21/9] min-h-[400px]",
    banner: "aspect-[3/1] md:aspect-[4/1] min-h-[250px]",
    tile: "aspect-square",
    card: "aspect-[4/5]"
  }[layout];

  const hasControls = data.showControls && slides.length > 1 && (layout === "hero" || layout === "banner");

  return (
    <div 
      className={`relative w-full overflow-hidden bg-navy-mid group ${containerClasses} ${layout === "tile" || layout === "card" ? "rounded-2xl" : ""}`}
      onMouseEnter={() => layout === "hero" && setIsPlaying(false)}
      onMouseLeave={() => layout === "hero" && data.autoplay && setIsPlaying(true)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          variants={currentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Media Layer */}
          <MediaLayer slide={currentSlide} layout={layout} />

          {/* Dark Gradient Overlay */}
          <div className={`absolute inset-0 pointer-events-none ${
            layout === "hero" ? "bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" :
            layout === "banner" ? "bg-black/30" :
            "bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          }`} />

          {/* Text Content */}
          {(currentSlide.headline || currentSlide.subtext || currentSlide.btnLabel || layout === "tile" || layout === "card") && (
            <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-10 ${
              layout === "hero" ? "items-center text-center pb-20" : 
              layout === "tile" || layout === "card" ? "items-center text-center p-5" :
              "items-start text-left"
            }`}>
              {currentSlide.headline && (
                <h2 className={`font-display font-bold text-white mb-2 shadow-sm ${
                  layout === "hero" ? "text-4xl md:text-5xl lg:text-6xl max-w-4xl" : 
                  layout === "banner" ? "text-2xl md:text-4xl" : 
                  "text-lg md:text-xl"
                }`}>
                  {currentSlide.headline}
                </h2>
              )}
              
              {currentSlide.subtext && layout !== "tile" && (
                <p className={`text-white/90 shadow-sm ${
                  layout === "hero" ? "text-lg md:text-xl max-w-2xl mb-8" :
                  layout === "card" ? "text-sm text-white/70 mb-4" :
                  "text-sm md:text-base max-w-md mb-4"
                }`}>
                  {currentSlide.subtext}
                </p>
              )}

              {currentSlide.btnLabel && currentSlide.btnUrl && (
                <Link 
                  href={currentSlide.btnUrl}
                  className={`inline-block font-bold transition-all ${
                    layout === "hero" ? "bg-gold hover:bg-gold-light text-navy px-8 py-3.5 rounded-full" :
                    layout === "banner" ? "bg-white hover:bg-page text-navy px-6 py-2 rounded-full text-sm" :
                    "bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full text-sm backdrop-blur-sm"
                  }`}
                >
                  {currentSlide.btnLabel}
                </Link>
              )}
              
              {/* If no custom text, but it's a tile/card, we can show the label */}
              {!currentSlide.headline && (layout === "tile" || layout === "card") && (
                <h3 className="font-display font-bold text-white text-xl">
                  {data.label}
                </h3>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {hasControls && (
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={prevSlide} className="h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-gold hover:text-navy backdrop-blur-md transition-colors" aria-label="Previous slide">
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button onClick={() => setIsPlaying(!isPlaying)} className="h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-gold hover:text-navy backdrop-blur-md transition-colors" aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <button onClick={nextSlide} className="h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-gold hover:text-navy backdrop-blur-md transition-colors" aria-label="Next slide">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Dots Indicator */}
      {hasControls && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-6 bg-gold" : "w-1.5 bg-white/50"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaLayer({ slide, layout }: { slide: Slide; layout: string }) {
  if (slide.mediaType === "video") {
    const videoUrl = buildCloudinaryUrl(slide.publicId, { format: "mp4" }).replace("/image/upload/", "/video/upload/");
    const posterUrl = slide.posterPublicId ? buildCloudinaryUrl(slide.posterPublicId, { format: "auto", quality: "auto", crop: "fill" }) : undefined;
    
    return (
      <video
        src={videoUrl}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        className={`w-full h-full object-cover ${layout === "tile" || layout === "card" ? "group-hover:scale-105 transition-transform duration-700" : ""}`}
      />
    );
  }

  // Image
  const imageUrl = buildCloudinaryUrl(slide.publicId, { 
    format: "auto", 
    quality: "auto", 
    crop: "fill" 
  });

  return (
    <Image
      src={imageUrl}
      alt={slide.altText || "Slider image"}
      fill
      priority={true}
      className={`object-cover ${layout === "tile" || layout === "card" ? "group-hover:scale-105 transition-transform duration-700" : ""}`}
      sizes="100vw"
    />
  );
}
