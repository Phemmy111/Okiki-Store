import { Metadata } from "next";
import { db } from "@/db";
import { categories, brands } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { asc } from "drizzle-orm";
import Link from "next/link";
import AddProductForm from "./form";

export const metadata: Metadata = { title: "Add Product | Admin" };

export default async function AddProductPage() {
  await requireAdminDb();

  const [allCategories, allBrands] = await Promise.all([
    db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name)),
    db.select({ id: brands.id, name: brands.name }).from(brands).orderBy(asc(brands.name)),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-text-muted hover:text-navy transition-colors text-sm">
          ← Back to Products
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-navy mb-1">Add New Product</h1>
        <p className="text-sm text-text-secondary">Fill in the details below to add a product to the store.</p>
      </div>

      <AddProductForm
        categories={allCategories}
        brands={allBrands}
        cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ""}
        apiKey={process.env.CLOUDINARY_API_KEY ?? ""}
      />
    </div>
  );
}
