"use client";

import {
  useState,
  useEffect,
  useRef,
  useReducer,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { buildCloudinaryUrl } from "@/lib/cloudinary-client";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { SlotDefaults } from "./MediaSlider";

/* ── Types ──────────────────────────────────────────────────────────────────── */
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
} | null;

interface Props {
  data: MediaSlot;
  fallbackSrc: string;
  fallbackAlt: string;
  defaults?: SlotDefaults[];
  children?: ReactNode;
  className?: string;
}

/* ── Image transition variants ─────────────────────────────────────────────── */
const imageVariants = {
  fade:     { enter: { opacity: 0 },         center: { opacity: 1 },         exit: { opacity: 0 } },
  slide:    { enter: { x: "100%", opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: "-100%", opacity: 0 } },
  zoom:     { enter: { scale: 1.08, opacity: 0 }, center: { scale: 1, opacity: 1 }, exit: { scale: 1.08, opacity: 0 } },
  parallax: { enter: { x: "40%", opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: "-15%", opacity: 0 } },
};

/* ── Text animation variants ────────────────────────────────────────────────── */
const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
  exit: { transition: { staggerChildren: 0.06 } },
};

const textLine = {
  hidden: { y: "110%", opacity: 0 },
  show:   { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  exit:   { y: "-60%", opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
};

const subtextVariant = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  show:   { opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, delay: 0.3, ease: "easeOut" } },
  exit:   { opacity: 0, filter: "blur(4px)", transition: { duration: 0.3 } },
};

const btnVariant = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5, ease: "easeOut" } },
  exit:   { opacity: 0, y: 8, transition: { duration: 0.25 } },
};

const reducedVariant = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
  exit:   { opacity: 0, transition: { duration: 0.3 } },
};

/* ── Component ─────────────────────────────────────────────────────────────── */
export default function MediaSliderClient({
  data,
  fallbackSrc,
  fallbackAlt,
  defaults,
  children,
  className,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const slides: Slide[] = data?.slides ?? [];
  const layout = (data?.layout ?? "hero") as "hero" | "banner" | "tile" | "card";
  const autoplay = data?.autoplay ?? true;
  const showControls = data?.showControls ?? true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const currentSlide: Slide | null = slides[currentIndex] ?? null;
  const duration = currentSlide?.durationOverrideMs || data?.defaultDurationMs || 5000;
  const transitionKey = (currentSlide?.transitionOverride || data?.defaultTransition || "fade") as keyof typeof imageVariants;
  const currentImgVariants = shouldReduceMotion ? reducedVariant : imageVariants[transitionKey] ?? imageVariants.fade;

  // Auto-advance
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    const t = setTimeout(() => setCurrentIndex(i => (i + 1) % slides.length), duration);
    return () => clearTimeout(t);
  }, [currentIndex, isPlaying, duration, slides.length]);

  const next = () => setCurrentIndex(i => (i + 1) % slides.length);
  const prev = () => setCurrentIndex(i => (i - 1 + slides.length) % slides.length);

  // Slide-level defaults: merge per-slide fields with defaults[index] fallback
  function resolveSlideText(slide: Slide | null, idx: number) {
    const def = defaults?.[idx];
    return {
      headline: slide?.headline ?? def?.headline ?? null,
      subtext:  slide?.subtext  ?? def?.subtext  ?? null,
      btnLabel: slide?.btnLabel ?? def?.btnLabel ?? null,
      btnUrl:   slide?.btnUrl   ?? def?.btnUrl   ?? null,
    };
  }

  const resolved = resolveSlideText(currentSlide, currentIndex);

  const containerCls = {
    hero:   "aspect-[16/9] md:aspect-[21/9] min-h-[400px]",
    banner: "aspect-[3/1] md:aspect-[4/1] min-h-[200px]",
    tile:   "aspect-square",
    card:   "aspect-[4/5]",
  }[layout];

  const hasControls = showControls && slides.length > 1 && (layout === "hero" || layout === "banner");

  /* ------------- Gradient overlay per layout ------------- */
  const gradientCls =
    layout === "hero"
      ? "bg-gradient-to-t from-navy/90 via-navy/50 to-navy/10"
      : layout === "banner"
      ? "bg-gradient-to-t from-navy/80 via-navy/30 to-transparent"
      : "bg-gradient-to-t from-black/85 via-black/30 to-transparent";

  /* ------------- Text position per layout ------------- */
  const textPosCls =
    layout === "hero"
      ? "items-center text-center pb-24 px-6 md:px-12"
      : layout === "tile" || layout === "card"
      ? "items-center text-center p-4"
      : "items-start text-left pb-10 px-6 md:px-12";

  return (
    <div
      className={`relative w-full overflow-hidden bg-navy-mid group ${containerCls} ${
        layout === "tile" || layout === "card" ? "rounded-2xl" : ""
      } ${className ?? ""}`}
      onMouseEnter={() => layout === "hero" && setIsPlaying(false)}
      onMouseLeave={() => layout === "hero" && autoplay && setIsPlaying(true)}
      tabIndex={hasControls ? 0 : undefined}
      onKeyDown={hasControls ? (e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      } : undefined}
    >
      {/* ── BACKGROUND LAYER (slides or fallback) ───────────────────────────── */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={currentSlide?.id ?? "fallback"}
          variants={currentImgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: shouldReduceMotion ? 0.3 : 0.85, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {currentSlide ? (
            <MediaLayer slide={currentSlide} layout={layout} />
          ) : (
            <Image
              src={fallbackSrc}
              alt={fallbackAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── GRADIENT OVERLAY ────────────────────────────────────────────────── */}
      <div className={`absolute inset-0 pointer-events-none ${gradientCls}`} />

      {/* ── SLIDE TEXT (headline / subtext / btn from slide or defaults) ─────── */}
      {(resolved.headline || resolved.subtext || resolved.btnLabel) && (
        <div className={`absolute inset-0 flex flex-col justify-end z-10 ${textPosCls}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={shouldReduceMotion ? reducedVariant : textContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col gap-3"
            >
              {resolved.headline && (
                <div className="overflow-hidden">
                  <motion.h2
                    variants={shouldReduceMotion ? reducedVariant : textLine}
                    className={`font-display font-bold text-white leading-tight drop-shadow-lg ${
                      layout === "hero"
                        ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                        : layout === "banner"
                        ? "text-2xl md:text-4xl"
                        : "text-xl md:text-2xl"
                    }`}
                  >
                    {/* Gold-highlight word parsing: wrap "Reliable" in gold */}
                    {resolved.headline.split(" ").map((word, wi) => {
                      const goldWords = ["Reliable", "Gold", "Premium", "Trusted"];
                      return goldWords.includes(word) ? (
                        <span key={wi} className="text-gold relative">
                          {word}{" "}
                        </span>
                      ) : (
                        <span key={wi}>{word} </span>
                      );
                    })}
                  </motion.h2>
                </div>
              )}

              {resolved.subtext && layout !== "tile" && (
                <motion.p
                  variants={shouldReduceMotion ? reducedVariant : subtextVariant}
                  className={`text-white/90 drop-shadow-md ${
                    layout === "hero"
                      ? "text-base sm:text-lg md:text-xl max-w-2xl"
                      : layout === "card"
                      ? "text-sm text-white/80"
                      : "text-sm md:text-base max-w-lg"
                  }`}
                >
                  {resolved.subtext}
                </motion.p>
              )}

              {resolved.btnLabel && resolved.btnUrl && (
                <motion.div variants={shouldReduceMotion ? reducedVariant : btnVariant}>
                  <Link
                    href={resolved.btnUrl}
                    className={`inline-block font-bold transition-all duration-200 ${
                      layout === "hero"
                        ? "mt-2 border-2 border-gold text-gold hover:bg-gold hover:text-navy px-8 py-3.5 rounded-full"
                        : layout === "banner"
                        ? "border border-white text-white hover:bg-white hover:text-navy px-6 py-2 rounded-full text-sm"
                        : "border border-white/60 text-white hover:bg-white/20 px-5 py-2 rounded-full text-sm"
                    }`}
                  >
                    {resolved.btnLabel}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── CHILDREN (always-on text from the page, above the slide text) ────── */}
      {children && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
          {children}
        </div>
      )}

      {/* ── CONTROLS ────────────────────────────────────────────────────────── */}
      {hasControls && (
        <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={prev} className="h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-gold hover:text-navy backdrop-blur-md transition-colors" aria-label="Previous slide">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={() => setIsPlaying(p => !p)} className="h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-gold hover:text-navy backdrop-blur-md transition-colors" aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button onClick={next} className="h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-gold hover:text-navy backdrop-blur-md transition-colors" aria-label="Next slide">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* ── DOTS ────────────────────────────────────────────────────────────── */}
      {hasControls && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "w-6 bg-gold" : "w-1.5 bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── MediaLayer ─────────────────────────────────────────────────────────────── */
function MediaLayer({ slide, layout }: { slide: Slide; layout: string }) {
  const tileOrCard = layout === "tile" || layout === "card";

  if (slide.mediaType === "video") {
    const src = buildCloudinaryUrl(slide.publicId, { format: "mp4" }).replace("/image/upload/", "/video/upload/");
    const poster = slide.posterPublicId
      ? buildCloudinaryUrl(slide.posterPublicId, { format: "auto", quality: "auto", crop: "fill" })
      : undefined;
    return (
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className={`w-full h-full object-cover ${tileOrCard ? "group-hover:scale-105 transition-transform duration-700" : ""}`}
      />
    );
  }

  const src = buildCloudinaryUrl(slide.publicId, { format: "auto", quality: "auto", crop: "fill" });
  return (
    <Image
      src={src}
      alt={slide.altText ?? "Slide"}
      fill
      priority
      className={`object-cover ${tileOrCard ? "group-hover:scale-105 transition-transform duration-700" : ""}`}
      sizes="100vw"
    />
  );
}
