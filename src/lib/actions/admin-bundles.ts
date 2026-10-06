"use server";
import { db } from "@/db";
import { bundles, bundleItems } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/* ── Create Bundle ──────────────────────────────────────────────────────── */
export async function createBundleAction(formData: FormData) {
  await requireAdminDb();

  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string).trim() || null;
  const priceMode = (formData.get("priceMode") as string) || "show";
  const rawPrice = formData.get("price") as string;
  const priceKobo = rawPrice ? Math.round(parseFloat(rawPrice) * 100) : null;
  const isPublished = formData.get("isPublished") === "on";

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  await db.insert(bundles).values({
    name,
    slug,
    description,
    priceKobo,
    priceMode,
    isPublished,
  });

  revalidatePath("/admin/bundles");
}

/* ── Delete Bundle ──────────────────────────────────────────────────────── */
export async function deleteBundleAction(id: number) {
  await requireAdminDb();
  await db.delete(bundles).where(eq(bundles.id, id));
  revalidatePath("/admin/bundles");
}

/* ── Add Item to Bundle ─────────────────────────────────────────────────── */
export async function addBundleItemAction(formData: FormData) {
  await requireAdminDb();

  const bundleId = parseInt(formData.get("bundleId") as string);
  const productId = parseInt(formData.get("productId") as string);
  const qty = parseInt(formData.get("qty") as string) || 1;

  await db.insert(bundleItems).values({ bundleId, productId, qty });
  revalidatePath("/admin/bundles");
}

/* ── Remove Item from Bundle ────────────────────────────────────────────── */
export async function removeBundleItemAction(itemId: number) {
  await requireAdminDb();
  await db.delete(bundleItems).where(eq(bundleItems.id, itemId));
  revalidatePath("/admin/bundles");
}
