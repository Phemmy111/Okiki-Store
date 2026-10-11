"use server";
import { db } from "@/db";
import { products, productMedia } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function editProductAction(formData: FormData) {
  await requireAdminDb();

  const id = parseInt(formData.get("id") as string, 10);
  if (!id || isNaN(id)) {
    throw new Error("Invalid product ID");
  }

  const thumbnail = (formData.get("thumbnail") as string) || "";
  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    throw new Error("Product name is required");
  }

  const description = (formData.get("description") as string)?.trim() || null;

  const rawCat = formData.get("categoryId") as string;
  const categoryId = rawCat && !isNaN(parseInt(rawCat, 10)) ? parseInt(rawCat, 10) : null;

  const rawBrand = formData.get("brandId") as string;
  const brandId = rawBrand && !isNaN(parseInt(rawBrand, 10)) ? parseInt(rawBrand, 10) : null;

  const priceMode = (formData.get("priceMode") as string) || "show";

  const priceStr = formData.get("price") as string | null;
  const priceNaira = priceStr !== null && priceStr.trim() !== "" ? parseFloat(priceStr) : null;
  const priceKobo = priceNaira !== null && !isNaN(priceNaira) ? Math.round(priceNaira * 100) : null;

  const compareAtStr = formData.get("compareAt") as string | null;
  const compareAtNaira = compareAtStr !== null && compareAtStr.trim() !== "" ? parseFloat(compareAtStr) : null;
  const compareAtKobo = compareAtNaira !== null && !isNaN(compareAtNaira) ? Math.round(compareAtNaira * 100) : null;

  const stockStatus = (formData.get("stockStatus") as string) || "in_stock";
  const stockQtyStr = formData.get("stockQty") as string | null;
  const stockQty = stockQtyStr && !isNaN(parseInt(stockQtyStr, 10)) ? parseInt(stockQtyStr, 10) : 0;

  const warrantyNote = (formData.get("warrantyNote") as string)?.trim() || null;
  const deliveryNote = (formData.get("deliveryNote") as string)?.trim() || null;

  const isFeatured = formData.get("isFeatured") === "on";
  const isNewArrival = formData.get("isNewArrival") === "on";
  const isHotDeal = formData.get("isHotDeal") === "on";
  const isPublished = formData.get("isPublished") === "on";

  const mediaPublicIds = (formData.get("mediaPublicIds") as string || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const mediaTypes = (formData.get("mediaTypes") as string || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [existingProduct] = await db.select().from(products).where(eq(products.id, id));
  if (!existingProduct) {
    throw new Error("Product not found");
  }

  await db
    .update(products)
    .set({
      name,
      description,
      categoryId,
      brandId,
      priceKobo: priceMode === "show" ? priceKobo : null,
      compareAtKobo: priceMode === "show" ? compareAtKobo : null,
      priceMode,
      stockStatus,
      stockQty,
      warrantyNote,
      deliveryNote,
      isFeatured,
      isNewArrival,
      isHotDeal,
      isPublished,
    })
    .where(eq(products.id, id));

  // Delete old media and replace with updated set
  await db.delete(productMedia).where(eq(productMedia.productId, id));

  const allMedia: { productId: number; publicId: string; type: "image" | "video"; sortOrder: number }[] = [];

  if (thumbnail) {
    allMedia.push({ productId: id, publicId: thumbnail, type: "image", sortOrder: 0 });
  }

  if (mediaPublicIds.length > 0) {
    mediaPublicIds.forEach((publicId, i) => {
      if (publicId !== thumbnail) {
        allMedia.push({
          productId: id,
          publicId,
          type: (mediaTypes[i] === "video" ? "video" : "image") as "image" | "video",
          sortOrder: allMedia.length,
        });
      }
    });
  }

  if (allMedia.length > 0) {
    await db.insert(productMedia).values(allMedia);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/products/${existingProduct.slug}`);
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}
