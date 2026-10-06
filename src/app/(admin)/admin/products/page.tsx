import { Metadata } from "next";
import { db } from "@/db";
import { products, categories, brands } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { desc, eq } from "drizzle-orm";
import AdminProductsClient from "./client";

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
      imagePublicId: products.imagePublicId,
      category: { id: categories.id, name: categories.name },
      brand: { id: brands.id, name: brands.name },
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .orderBy(desc(products.id));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Products</h1>
          <p className="text-sm text-text-secondary">Manage store inventory, prices, and stock status.</p>
        </div>
        <button className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-mid">
          + Add Product
        </button>
      </div>
      
      <AdminProductsClient
        products={allProducts}
        cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ""}
      />
    </div>
  );
}
