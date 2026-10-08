"use server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";

type QuoteItemInput = {
  productId: number | null;
  productNameSnapshot: string;
  qty: number;
  priceKobo: number | null;
};

export async function submitQuoteAction(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const businessName = (formData.get("businessName") as string).trim() || null;
  const message = (formData.get("message") as string).trim() || null;
  const itemsJson = formData.get("items") as string;
  const receiptUrl = (formData.get("receiptUrl") as string) || null;

  if (!name || !phone || !email) {
    return { error: "Name, email, and phone are required." };
  }

  let items: QuoteItemInput[] = [];
  try {
    items = JSON.parse(itemsJson);
  } catch {
    return { error: "Invalid order items." };
  }

  if (!items.length) {
    return { error: "Your bag is empty." };
  }

  const hasUnpriced = items.some(i => i.priceKobo === null);
  const totalKobo = hasUnpriced ? null : items.reduce((sum, i) => sum + ((i.priceKobo || 0) * i.qty), 0);
  const reference = "OKI-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, "0");

  const [inserted] = await db
    .insert(orders)
    .values({ 
      reference,
      customerName: name, 
      customerPhone: phone, 
      customerEmail: email,
      deliveryMethod: "delivery", // Defaulting to delivery for now
      notes: message ? (businessName ? \Business: \\\nMessage: \\ : message) : (businessName ? \Business: \\ : null),
      receiptUrl, 
      totalKobo,
      status: "processing", // The user asked for "processing, confirmed, delivered, rejected". We'll start with processing
      paymentMethod: receiptUrl ? "transfer" : null,
      paymentStatus: receiptUrl ? "unpaid" : "unpaid" // admin verifies to make it paid
    })
    .returning({ id: orders.id, reference: orders.reference });

  await db.insert(orderItems).values(
    items.map((item) => ({
      orderId: inserted.id,
      productId: item.productId,
      productNameSnapshot: item.productNameSnapshot,
      qty: item.qty,
      priceKobo: item.priceKobo
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
        { name, phone, businessName, message, receiptUrl },
        items.map((i) => ({ name: i.productNameSnapshot, qty: i.qty })),
        inserted.id // Wait, email template expects quoteId as number, it will print #ID.
      );
    }
  } catch (error) {
    console.error("Failed to send admin order notification:", error);
  }

  return { success: true, quoteId: inserted.id, reference: inserted.reference };
}

export async function getCloudinaryKeys() {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY
  };
}
