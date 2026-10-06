"use server";
import { db } from "@/db";
import { quoteRequests, quoteItems } from "@/db/schema";

type QuoteItemInput = {
  productId: number | null;
  productNameSnapshot: string;
  qty: number;
};

export async function submitQuoteAction(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const businessName = (formData.get("businessName") as string).trim() || null;
  const message = (formData.get("message") as string).trim() || null;
  const itemsJson = formData.get("items") as string;

  if (!name || !phone) {
    return { error: "Name and phone are required." };
  }

  let items: QuoteItemInput[] = [];
  try {
    items = JSON.parse(itemsJson);
  } catch {
    return { error: "Invalid quote items." };
  }

  if (!items.length) {
    return { error: "Your quote is empty." };
  }

  // Insert quote request
  const [inserted] = await db
    .insert(quoteRequests)
    .values({ name, phone, businessName, message, status: "new" })
    .returning({ id: quoteRequests.id });

  // Insert all items
  await db.insert(quoteItems).values(
    items.map((item) => ({
      quoteId: inserted.id,
      productId: item.productId,
      productNameSnapshot: item.productNameSnapshot,
      qty: item.qty,
    }))
  );

  return { success: true, quoteId: inserted.id };
}
