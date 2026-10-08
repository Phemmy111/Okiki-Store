import "server-only";
import { db } from "@/db";
import {
  categories,
  products,
  productMedia,
  bundles,
  bundleItems,
  mediaSlots,
  slides,
  settings,
} from "@/db/schema";
import { eq, and, desc, asc, inArray, ilike, count, gte, lte, or } from "drizzle-orm";

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
    .where(eq(products.isPublished, true))
    .orderBy(desc(products.id))
    .limit(limit);

  return attachPrimaryMedia(prods);
}

export async function getNewArrivals(limit = 6) {
  const prods = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true))
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

// ── SHOP PAGE (paginated + filtered) ─────────────────────────────────────────
export async function getShopProducts({
  page = 1,
  perPage = 24,
  categorySlug,
  minPrice,
  maxPrice,
  q,
}: {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}) {
  const conditions: any[] = [eq(products.isPublished, true)];

  // Filter by category slug
  if (categorySlug) {
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);
    if (cat.length) conditions.push(eq(products.categoryId, cat[0].id));
  }

  // Search query
  if (q) {
    conditions.push(
      or(
        ilike(products.name, `%${q}%`),
        ilike(products.description, `%${q}%`)
      )
    );
  }

  // Price filters (stored in kobo, user provides naira)
  if (minPrice) conditions.push(gte(products.priceKobo, minPrice * 100));
  if (maxPrice) conditions.push(lte(products.priceKobo, maxPrice * 100));

  const where = conditions.length === 1 ? conditions[0] : and(...conditions);

  const [totalRow] = await db
    .select({ total: count() })
    .from(products)
    .where(where);

  const prods = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(desc(products.id))
    .limit(perPage)
    .offset((page - 1) * perPage);

  const items = await attachPrimaryMedia(prods);
  return { items, total: totalRow.total, page, perPage };
}

// ── SEARCH ────────────────────────────────────────────────────────────────────
export async function searchProducts(q: string, limit = 24) {
  if (!q.trim()) return [];
  const prods = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isPublished, true),
        or(
          ilike(products.name, `%${q}%`),
          ilike(products.description, `%${q}%`)
        )
      )
    )
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

// ── BUNDLES ───────────────────────────────────────────────────────────────────
export async function getBundles() {
  return await db
    .select()
    .from(bundles)
    .where(eq(bundles.isPublished, true))
    .orderBy(asc(bundles.id));
}

export async function getBundleBySlug(slug: string) {
  const bRes = await db
    .select()
    .from(bundles)
    .where(eq(bundles.slug, slug))
    .limit(1);

  if (!bRes.length) return null;
  const bundle = bRes[0];

  // Get items
  const items = await db
    .select({
      id: bundleItems.id,
      qty: bundleItems.qty,
      product: products,
    })
    .from(bundleItems)
    .leftJoin(products, eq(bundleItems.productId, products.id))
    .where(eq(bundleItems.bundleId, bundle.id));

  // Attach primary media to items
  const productList = items.map((i) => i.product).filter(Boolean);
  const productsWithMedia = await attachPrimaryMedia(productList);

  const enrichedItems = items.map((i) => ({
    ...i,
    product: productsWithMedia.find((p) => p.id === i.product?.id),
  }));

  return { ...bundle, items: enrichedItems };
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
