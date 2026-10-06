import { Metadata } from "next";
import { db } from "@/db";
import { products, categories, brands } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { desc, eq } from "drizzle-orm";
import AdminProductsClient from "./client";
import Link from "next/link";

export const metadata: Metadata = { title: "Products | Admin" };

export default async function AdminProductsPage() {
  await requireAdminDb();

  // Fetch products with their category and brand names
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      priceKobo: products.priceKobo,
      stockStatus: products.stockStatus,
      isFeatured: products.isFeatured,
      category: { id: categories.id, name: categories.name },
      brand: { id: brands.id, name: brands.name },
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .orderBy(desc(products.id));

  // Get primary media for the products
  const { productMedia } = await import("@/db/schema");
  const { inArray, asc } = await import("drizzle-orm");
  
  const allMedia = allProducts.length > 0 ? await db
    .select()
    .from(productMedia)
    .where(inArray(productMedia.productId, allProducts.map(p => p.id)))
    .orderBy(asc(productMedia.sortOrder), desc(productMedia.id)) : [];

  const mediaMap = new Map();
  for (const media of allMedia) {
    if (!mediaMap.has(media.productId)) {
      mediaMap.set(media.productId, media.publicId);
    }
  }

  const productsWithMedia = allProducts.map((p) => ({
    ...p,
    imagePublicId: mediaMap.get(p.id) || null,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Products</h1>
          <p className="text-sm text-text-secondary">Manage store inventory, prices, and stock status.</p>
        </div>
        <Link href="/admin/products/new" className="shrink-0 bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-mid transition-colors w-full sm:w-auto text-center inline-block">
          + Add Product
        </Link>
      </div>
      
      <AdminProductsClient
        products={productsWithMedia}
        cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ""}
      />
    </div>
  );
}
