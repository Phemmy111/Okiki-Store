"use server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function fetchMyOrdersAction(references: string[]) {
  if (!references || references.length === 0) return [];

  const foundOrders = await db.select().from(orders).where(inArray(orders.reference, references));
  
  if (foundOrders.length === 0) return [];

  const orderIds = foundOrders.map(o => o.id);
  const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));

  return foundOrders.map(o => ({
    ...o,
    items: items.filter(i => i.orderId === o.id)
  })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function trackOrderAction(reference: string, email: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.reference, reference));

  if (!order || order.customerEmail?.toLowerCase() !== email.toLowerCase()) {
    return { error: "Order not found or email does not match." };
  }

  return { success: true };
}
