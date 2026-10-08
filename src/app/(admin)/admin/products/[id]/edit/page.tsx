import { db } from "@/db";
import { products, categories, brands, productMedia } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { eq, asc } from "drizzle-orm";
import EditProductForm from "./form";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminDb();
  
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    notFound();
  }

  // Fetch product and its media
  const [product] = await db.select().from(products).where(eq(products.id, productId));
  if (!product) {
    notFound();
  }

  const media = await db.select()
    .from(productMedia)
    .where(eq(productMedia.productId, productId))
    .orderBy(asc(productMedia.sortOrder));

  const productWithMedia = { ...product, media };

  const allCategories = await db.select().from(categories).orderBy(asc(categories.name));
  const allBrands = await db.select().from(brands).orderBy(asc(brands.name));

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

  if (!cloudName || !apiKey) {
    return (
      <div className="p-8 text-center text-red-500 font-medium bg-red-50 rounded-2xl">
        Cloudinary is not configured. Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_API_KEY.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Edit Product</h1>
        <p className="text-sm text-text-secondary mt-1">Update product details, pricing, and images.</p>
      </div>

      <EditProductForm
        product={productWithMedia}
        categories={allCategories}
        brands={allBrands}
        cloudName={cloudName}
        apiKey={apiKey}
      />
    </div>
  );
}
