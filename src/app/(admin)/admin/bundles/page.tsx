import type { Metadata } from "next";
import { db } from "@/db";
import { bundles, bundleItems, products, productMedia } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { eq, asc, desc } from "drizzle-orm";
import AdminBundlesClient from "./client";

export const metadata: Metadata = { title: "Bundles | Admin" };

export default async function AdminBundlesPage() {
  await requireAdminDb();

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  // Fetch all bundles ordered by ID
  const allBundles = await db
    .select()
    .from(bundles)
    .orderBy(asc(bundles.id));

  // Fetch all bundle items with their product info
  const allItems = await db
    .select({
      id: bundleItems.id,
      bundleId: bundleItems.bundleId,
      qty: bundleItems.qty,
      productId: bundleItems.productId,
      productName: products.name,
    })
    .from(bundleItems)
    .leftJoin(products, eq(bundleItems.productId, products.id));

  // Fetch primary media for products in bundles
  const productIdsInBundles = [...new Set(allItems.map((i) => i.productId))];
  let mediaMap: Record<number, string | null> = {};
  if (productIdsInBundles.length > 0) {
    const mediaRows = await db
      .select({ productId: productMedia.productId, publicId: productMedia.publicId })
      .from(productMedia)
      .where(eq(productMedia.sortOrder, 0));
    for (const row of mediaRows) {
      if (productIdsInBundles.includes(row.productId)) {
        mediaMap[row.productId] = row.publicId;
      }
    }
  }

  // Build enriched bundles
  const enrichedBundles = allBundles.map((bundle) => ({
    ...bundle,
    items: allItems
      .filter((item) => item.bundleId === bundle.id)
      .map((item) => ({
        id: item.id,
        qty: item.qty,
        product: item.productId
          ? {
              id: item.productId,
              name: item.productName ?? "Unknown",
              imagePublicId: mediaMap[item.productId] ?? null,
            }
          : null,
      })),
  }));

  // Fetch all published products for the "add item" dropdown
  const allProducts = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(eq(products.isPublished, true))
    .orderBy(asc(products.name));

  // Attach primary media to each product
  const allProductMedia = await db
    .select({ productId: productMedia.productId, publicId: productMedia.publicId })
    .from(productMedia)
    .where(eq(productMedia.sortOrder, 0));
  const productMediaMap = Object.fromEntries(
    allProductMedia.map((m) => [m.productId, m.publicId])
  );

  const productsWithMedia = allProducts.map((p) => ({
    ...p,
    imagePublicId: productMediaMap[p.id] ?? null,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Bundles</h1>
          <p className="text-sm text-text-secondary mt-1">
            Create product bundles and manage what's included in each one.
          </p>
        </div>
      </div>

      <AdminBundlesClient
        bundles={enrichedBundles}
        products={productsWithMedia}
        cloudName={cloudName}
      />
    </div>
  );
}
