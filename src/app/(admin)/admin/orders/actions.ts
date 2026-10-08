"use server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(id: number, status: string) {
  await requireAdminDb();
  const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning({ email: orders.customerEmail, reference: orders.reference, name: orders.customerName });
  revalidatePath("/admin/orders");
  
  if (updated && updated.email) {
    try {
      const { sendOrderStatusEmail } = await import("@/lib/email");
      await sendOrderStatusEmail(updated.email, updated.name, updated.reference, status);
    } catch (error) {
      console.error("Failed to send status update email:", error);
    }
  }
}

export async function deleteOrderAction(id: number) {
  await requireAdminDb();
  await db.delete(orders).where(eq(orders.id, id));
  revalidatePath("/admin/orders");
}
