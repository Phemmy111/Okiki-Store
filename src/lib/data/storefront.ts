import "server-only";
import { db } from "@/db";
import {
  categories,
  products,
  productMedia,
  bundles,
  mediaSlots,
  slides,
  settings,
} from "@/db/schema";
import { eq, and, desc, asc, inArray, isNull, sql } from "drizzle-orm";

// ── SETTINGS ──────────────────────────────────────────────────────────────────
export async function getStoreSettings() {
  const rows = await db.select().from(settings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

// ── MEDIA SLOTS ───────────────────────────────────────────────────────────────
export async function getMediaSlot(slug: string) {
  const slotRes = await db
    .select()
    .from(mediaSlots)
    .where(eq(mediaSlots.slug, slug))
    .limit(1);

  if (!slotRes.length) return null;
  const slot = slotRes[0];

  const activeSlides = await db
    .select()
    .from(slides)
    .where(
      and(
        eq(slides.slotId, slot.id),
        eq(slides.isActive, true)
      )
    )
    .orderBy(asc(slides.sortOrder), desc(slides.id));

  return { ...slot, slides: activeSlides };
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────
export async function getCategories() {
  return await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), desc(categories.id));
}

export async function getCategoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return result[0] || null;
}

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export async function getFeaturedProducts(limit = 4) {
  const prods = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isPublished, true),
        eq(products.isFeatured, true)
      )
    )
    .orderBy(desc(products.id))
    .limit(limit);

  return attachPrimaryMedia(prods);
}

export async function getNewArrivals(limit = 4) {
  const prods = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isPublished, true),
        eq(products.isNewArrival, true)
      )
    )
    .orderBy(desc(products.id))
    .limit(limit);

  return attachPrimaryMedia(prods);
}

export async function getProductsByCategory(categoryId: number, limit = 12) {
  const prods = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.categoryId, categoryId),
        eq(products.isPublished, true)
      )
    )
    .orderBy(desc(products.id))
    .limit(limit);

  return attachPrimaryMedia(prods);
}

export async function getAllProducts(limit = 48) {
  const prods = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true))
    .orderBy(desc(products.id))
    .limit(limit);

  return attachPrimaryMedia(prods);
}

export async function getProductBySlug(slug: string) {
  const prod = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!prod.length) return null;

  // Get all media for this product
  const media = await db
    .select()
    .from(productMedia)
    .where(eq(productMedia.productId, prod[0].id))
    .orderBy(asc(productMedia.sortOrder), desc(productMedia.id));

  return { ...prod[0], media };
}

// Helper to attach the first image (primary media) to a list of products
async function attachPrimaryMedia(productList: any[]) {
  if (productList.length === 0) return [];

  const productIds = productList.map((p) => p.id);
  
  // Get all media for these products
  const allMedia = await db
    .select()
    .from(productMedia)
    .where(inArray(productMedia.productId, productIds))
    .orderBy(asc(productMedia.sortOrder), desc(productMedia.id));

  // Map primary media by productId
  const mediaMap = new Map();
  for (const media of allMedia) {
    if (!mediaMap.has(media.productId)) {
      mediaMap.set(media.productId, media);
    }
  }

  return productList.map((p) => ({
    ...p,
    primaryMedia: mediaMap.get(p.id) || null,
  }));
}
