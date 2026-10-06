"use server";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateQuoteStatusAction(id: number, status: string) {
  await requireAdminDb();
  await db.update(quoteRequests).set({ status }).where(eq(quoteRequests.id, id));
  revalidatePath("/admin/quotes");
}

export async function deleteQuoteAction(id: number) {
  await requireAdminDb();
  await db.delete(quoteRequests).where(eq(quoteRequests.id, id));
  revalidatePath("/admin/quotes");
}
