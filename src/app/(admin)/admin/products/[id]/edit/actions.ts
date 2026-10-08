"use server";
import { db } from "@/db";
import { products, productMedia } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function editProductAction(formData: FormData) {
  await requireAdminDb();

  const id = parseInt(formData.get("id") as string);
  const thumbnail = formData.get("thumbnail") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : null;
  const brandId = formData.get("brandId") ? parseInt(formData.get("brandId") as string) : null;
  const priceMode = formData.get("priceMode") as string;
  const priceNaira = formData.get("price") ? parseFloat(formData.get("price") as string) : null;
  const compareAtNaira = formData.get("compareAt") ? parseFloat(formData.get("compareAt") as string) : null;
  const stockStatus = formData.get("stockStatus") as string;
  const stockQty = formData.get("stockQty") ? parseInt(formData.get("stockQty") as string) : 0;
  const warrantyNote = formData.get("warrantyNote") as string;
  const deliveryNote = formData.get("deliveryNote") as string;
  const isFeatured = formData.get("isFeatured") === "on";
  const isNewArrival = formData.get("isNewArrival") === "on";
  const isHotDeal = formData.get("isHotDeal") === "on";
  const isPublished = formData.get("isPublished") !== "off";
  const mediaPublicIds = (formData.get("mediaPublicIds") as string || "").split(",").filter(Boolean);
  const mediaTypes = (formData.get("mediaTypes") as string || "").split(",").filter(Boolean);

  // Auto-generate slug from name if name changed significantly, but here we can just update existing
  // Usually we keep the slug the same unless forced, but let's keep it simple and update the product.

  await db.update(products).set({
    name,
    description: description || null,
    categoryId,
    brandId,
    priceKobo: priceNaira ? Math.round(priceNaira * 100) : null,
    compareAtKobo: compareAtNaira ? Math.round(compareAtNaira * 100) : null,
    priceMode,
    stockStatus,
    stockQty,
    warrantyNote: warrantyNote || null,
    deliveryNote: deliveryNote || null,
    isFeatured,
    isNewArrival,
    isHotDeal,
    isPublished,
  }).where(eq(products.id, id));

  // Delete old media and replace
  await db.delete(productMedia).where(eq(productMedia.productId, id));

  // Save thumbnail first (sortOrder: 0), then additional media
  const allMedia: { productId: number; publicId: string; type: "image" | "video"; sortOrder: number }[] = [];

  if (thumbnail) {
    allMedia.push({ productId: id, publicId: thumbnail, type: "image", sortOrder: 0 });
  }

  if (mediaPublicIds.length > 0) {
    mediaPublicIds.forEach((publicId, i) => {
      allMedia.push({
        productId: id,
        publicId,
        type: (mediaTypes[i] === "video" ? "video" : "image") as "image" | "video",
        sortOrder: i + 1, // starts after thumbnail
      });
    });
  }

  if (allMedia.length > 0) {
    await db.insert(productMedia).values(allMedia);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}
