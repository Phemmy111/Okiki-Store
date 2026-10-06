"use server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ProductInsert = typeof products.$inferInsert;

export async function createProduct(data: ProductInsert) {
  await requireAdminDb();
  await db.insert(products).values(data);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateProduct(id: number, data: Partial<ProductInsert>) {
  await requireAdminDb();
  await db.update(products).set(data).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  if (data.slug) {
    revalidatePath(`/product/${data.slug}`);
  }
}

export async function deleteProduct(id: number) {
  await requireAdminDb();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
