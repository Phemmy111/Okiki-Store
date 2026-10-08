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

  const receiptUrl = (formData.get("receiptUrl") as string) || null;

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
    .values({ name, phone, businessName, message, receiptUrl, status: "new" })
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

  // Send email notification to super admins
  try {
    const { sendQuoteNotificationEmail } = await import("@/lib/email");
    const { admins } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const superAdmins = await db
      .select({ email: admins.email })
      .from(admins)
      .where(eq(admins.role, "super_admin"));

    const emails = superAdmins.map((a) => a.email);
    
    if (emails.length > 0) {
      await sendQuoteNotificationEmail(
        emails,
        { name, phone, businessName, message },
        items.map((i) => ({ name: i.productNameSnapshot, qty: i.qty })),
        inserted.id
      );
    }
  } catch (error) {
    console.error("Failed to send quote notification email:", error);
    // don't fail the quote submission if email fails
  }

  return { success: true, quoteId: inserted.id };
}
