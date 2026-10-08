import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { desc, eq } from "drizzle-orm";
import AdminOrdersClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Orders | Admin" };

export default async function AdminOrdersPage() {
  await requireAdminDb();

  const allOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.isSample, false))
    .orderBy(desc(orders.createdAt));

  const allItems = await db.select().from(orderItems);

  const grouped = allOrders.map((o) => {
    return {
      ...o,
      items: allItems.filter((i) => i.orderId === o.id),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Orders</h1>
          <p className="text-sm text-text-secondary">View and manage customer orders.</p>
        </div>
      </div>
      <AdminOrdersClient orders={grouped} />
    </div>
  );
}
