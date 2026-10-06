import type { Metadata } from "next";
import { db } from "@/db";
import { quoteRequests, quoteItems } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { eq, desc, and } from "drizzle-orm";
import AdminQuotesClient from "./client";

export const metadata: Metadata = { title: "Quote Requests | Admin" };

export default async function AdminQuotesPage() {
  await requireAdminDb();

  // Fetch all real quote requests (not samples), newest first
  const allQuotes = await db
    .select()
    .from(quoteRequests)
    .where(eq(quoteRequests.isSample, false))
    .orderBy(desc(quoteRequests.createdAt));

  // Fetch all items for those quotes
  const allItems = await db.select().from(quoteItems);

  // Group items by quoteId
  const itemsByQuote: Record<number, typeof allItems> = {};
  for (const item of allItems) {
    if (!itemsByQuote[item.quoteId]) itemsByQuote[item.quoteId] = [];
    itemsByQuote[item.quoteId].push(item);
  }

  // Enrich quotes with their items
  const enrichedQuotes = allQuotes.map((q) => ({
    ...q,
    items: (itemsByQuote[q.id] ?? []).map((i) => ({
      id: i.id,
      productNameSnapshot: i.productNameSnapshot,
      qty: i.qty,
    })),
  }));

  const newCount = allQuotes.filter((q) => q.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-navy">Quote Requests</h1>
            {newCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {newCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1">
            {allQuotes.length} total request{allQuotes.length !== 1 ? "s" : ""}. Update status as you follow up with customers.
          </p>
        </div>
      </div>

      <AdminQuotesClient quotes={enrichedQuotes} />
    </div>
  );
}
