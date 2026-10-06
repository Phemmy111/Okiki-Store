import { getMediaSlot } from "@/lib/data/storefront";
import MediaSliderClient from "./MediaSliderClient";
import type { ReactNode } from "react";

// Per-slot fallback background config
const SLOT_FALLBACKS: Record<string, { src: string; alt: string }> = {
  "home-hero":         { src: "/fallbacks/hero-salon.webp",   alt: "A well-lit salon interior with styling chairs and mirrors" },
  "shop-banner":       { src: "/fallbacks/hero-home.webp",    alt: "Modern home appliances arranged on a counter" },
  "tile-salon":        { src: "/fallbacks/tile-salon.webp",   alt: "Salon styling chairs and mirrors" },
  "tile-home":         { src: "/fallbacks/hero-home.webp",    alt: "Home electronics display" },
  "tile-power":        { src: "/fallbacks/hero-power.webp",   alt: "Generator and power setup" },
  "tile-creator":      { src: "/fallbacks/hero-creator.webp", alt: "Creator desk with ring light" },
  "bundle-starter":    { src: "/fallbacks/tile-salon.webp",   alt: "Starter salon bundle" },
  "bundle-standard":   { src: "/fallbacks/hero-salon.webp",   alt: "Standard salon bundle" },
  "bundle-premium":    { src: "/fallbacks/hero-creator.webp", alt: "Premium salon bundle" },
  "visit-us":          { src: "/fallbacks/hero-home.webp",    alt: "Store exterior" },
  "cat-salon-beauty":  { src: "/fallbacks/tile-salon.webp",   alt: "Salon and beauty category" },
  "cat-home-electronics": { src: "/fallbacks/hero-home.webp", alt: "Home electronics category" },
  "cat-power-generators": { src: "/fallbacks/hero-power.webp", alt: "Power and generators category" },
  "cat-creator-gear":  { src: "/fallbacks/hero-creator.webp", alt: "Creator gear category" },
};

export interface SlotDefaults {
  headline?: string;
  subtext?: string;
  btnLabel?: string;
  btnUrl?: string;
}

export interface MediaSliderProps {
  slot: string;
  /** Legacy overlay (fills inset-0) */
  children?: ReactNode;
  /** Static content to show above the animated headline (Hero only) */
  overlayTop?: ReactNode;
  /** Static content to show below the animated headline (Hero only) */
  overlayBottom?: ReactNode;
  /** Per-slide default text. If a slide has no headline/subtext/btn, these are used. */
  defaults?: SlotDefaults[];
  className?: string;
}

export default async function MediaSlider({
  slot,
  children,
  overlayTop,
  overlayBottom,
  defaults,
  className,
}: MediaSliderProps) {
  const data = await getMediaSlot(slot);
  const fallback = SLOT_FALLBACKS[slot];

  return (
    <MediaSliderClient
      data={data}
      fallbackSrc={fallback?.src ?? "/fallbacks/hero-salon.webp"}
      fallbackAlt={fallback?.alt ?? "OKIKI Store"}
      defaults={defaults}
      overlayTop={overlayTop}
      overlayBottom={overlayBottom}
      className={className}
    >
      {children}
    </MediaSliderClient>
  );
}
