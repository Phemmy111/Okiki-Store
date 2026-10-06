"use server";
import { db } from "@/db";
import { products, productMedia } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProductAction(formData: FormData) {
  await requireAdminDb();

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

  // Auto-generate slug from name
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Date.now();

  const [product] = await db.insert(products).values({
    name,
    slug,
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
    specs: [],
  }).returning({ id: products.id });

  // Save uploaded images
  if (mediaPublicIds.length > 0) {
    await db.insert(productMedia).values(
      mediaPublicIds.map((publicId, i) => ({
        productId: product.id,
        publicId,
        type: "image" as const,
        sortOrder: i,
      }))
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}
