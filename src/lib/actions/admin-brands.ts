"use server";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type BrandInsert = typeof brands.$inferInsert;

export async function createBrand(data: BrandInsert) {
  await requireAdminDb();
  await db.insert(brands).values(data);
  revalidatePath("/admin/brands");
  revalidatePath("/shop");
}

export async function deleteBrand(id: number) {
  await requireAdminDb();
  await db.delete(brands).where(eq(brands.id, id));
  revalidatePath("/admin/brands");
  revalidatePath("/shop");
}
