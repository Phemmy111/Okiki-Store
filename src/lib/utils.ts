import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Tailwind class merger ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Currency formatting ───────────────────────────────────────────────────────
// Prices are stored as integers in kobo (1 NGN = 100 kobo)
const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(kobo: number): string {
  return nairaFormatter.format(kobo / 100);
}

export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

// ── WhatsApp ──────────────────────────────────────────────────────────────────
export function buildWhatsAppUrl(phone: string, message?: string): string {
  // Strip all non-digits, ensure country code present
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

// ── Slug ──────────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Cloudinary URL builder (for manual use outside next/image) ────────────────
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.warn("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
    return "";
  }

  const transforms: string[] = [
    `f_${options.format ?? "auto"}`,
    `q_${options.quality ?? "auto"}`,
  ];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}

// ── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// ── Misc ──────────────────────────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "…";
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
