// WhatsApp message formatters for OKIKI Electronics Store
// These build pre-filled WhatsApp URLs for different flows.

import { buildWhatsAppUrl } from "@/lib/utils";
import type { QuoteItem } from "@/types";

const PRIMARY = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348022932216";

// ── Single product enquiry ────────────────────────────────────────────────────
export function buildProductEnquiryUrl(
  productName: string,
  productUrl: string,
  phone = PRIMARY
): string {
  const message =
    `Hi, I'm interested in *${productName}*.\n\n` +
    `Product link: ${productUrl}\n\n` +
    `Please let me know the price and availability. Thank you!`;
  return buildWhatsAppUrl(phone, message);
}

// ── Wholesale price request ───────────────────────────────────────────────────
export function buildWholesaleEnquiryUrl(
  productName: string,
  productUrl: string,
  phone = PRIMARY
): string {
  const message =
    `Hi, I'd like to enquire about *wholesale pricing* for:\n\n` +
    `*${productName}*\n${productUrl}\n\n` +
    `Please share your wholesale rates. Thank you!`;
  return buildWhatsAppUrl(phone, message);
}

// ── Quote list send ───────────────────────────────────────────────────────────
export function buildQuoteListUrl(
  items: QuoteItem[],
  customerName?: string,
  phone = PRIMARY
): string {
  const greeting = customerName ? `Hi, I'm *${customerName}* and I'd` : "Hi, I'd";
  const itemLines = items
    .map(
      (item) =>
        `• *${item.productName}* × ${item.qty}` +
        (item.priceKobo ? "" : " (price enquiry)")
    )
    .join("\n");

  const message =
    `${greeting} like to request a quote for the following items:\n\n` +
    `${itemLines}\n\n` +
    `Please let me know the total price and availability. Thank you!`;

  return buildWhatsAppUrl(phone, message);
}

// ── Bundle enquiry ────────────────────────────────────────────────────────────
export function buildBundleEnquiryUrl(
  bundleName: string,
  phone = PRIMARY
): string {
  const message =
    `Hi, I'm interested in the *${bundleName}* bundle.\n\n` +
    `Could you please send me a quote? Thank you!`;
  return buildWhatsAppUrl(phone, message);
}
