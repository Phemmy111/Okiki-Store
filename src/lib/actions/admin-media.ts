"use server";

import { db } from "../db";
import { slides } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAdminDb } from "../data/auth";
import { revalidatePath } from "next/cache";

export async function createSlide(data: any) {
  await requireAdminDb();
  await db.insert(slides).values({
    ...data,
  });
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateSlide(id: number, data: any) {
  await requireAdminDb();
  await db.update(slides).set(data).where(eq(slides.id, id));
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteSlide(id: number) {
  await requireAdminDb();
  await db.delete(slides).where(eq(slides.id, id));
  revalidatePath("/", "layout");
  return { success: true };
}
