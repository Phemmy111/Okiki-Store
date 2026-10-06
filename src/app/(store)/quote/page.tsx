"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useQuoteStore } from "@/store/quoteStore";
import { submitQuoteAction } from "@/lib/actions/submit-quote";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export default function QuotePage() {
  const { items, removeItem, updateQty, clearQuote } = useQuoteStore();
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set(
      "items",
      JSON.stringify(
        items.map((i) => ({
          productId: i.productId,
          productNameSnapshot: i.name,
          qty: i.qty,
        }))
      )
    );

    startTransition(async () => {
      const result = await submitQuoteAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
        clearQuote();
      }
    });
  };

  /* ── Submitted state ──────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="font-display text-2xl font-bold text-navy mb-2">
          Quote Request Sent!
        </h1>
        <p className="text-text-secondary max-w-sm mb-6">
          Thank you! We've received your request and will contact you shortly on WhatsApp or by phone.
        </p>
        <Link
          href="/shop"
          className="bg-navy text-white font-bold px-8 py-3 rounded-full hover:bg-navy-mid transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ── Empty state ──────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="w-16 h-16 text-border mb-4" />
        <h1 className="font-display text-2xl font-bold text-navy mb-2">
          Your Quote List is Empty
        </h1>
        <p className="text-text-secondary max-w-sm mb-6">
          Browse our products and tap the bag icon to add items to your quote.
        </p>
        <Link
          href="/shop"
          className="bg-navy text-white font-bold px-8 py-3 rounded-full hover:bg-navy-mid transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  /* ── Main quote page ──────────────────────────────────────────── */
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32 md:pb-10">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-navy mb-2">
        Your Quote List
      </h1>
      <p className="text-text-secondary text-sm mb-8">
        {items.length} item{items.length !== 1 ? "s" : ""} — fill in your details and we'll get back to you.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Items list ── */}
        <div className="lg:col-span-3 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 bg-white border border-border rounded-2xl p-4 shadow-sm"
            >
              {/* Image */}
              <div className="w-16 h-16 relative rounded-xl overflow-hidden border border-border bg-page shrink-0">
                {item.imagePublicId ? (
                  <Image
                    src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_120,h_120,c_fill/${item.imagePublicId}`}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-semibold text-navy text-sm hover:text-blue transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                {item.priceKobo ? (
                  <p className="text-xs text-text-muted mt-0.5">
                    ₦{(item.priceKobo / 100).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xs text-gold font-medium mt-0.5">Ask for price</p>
                )}
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQty(item.productId, item.qty - 1)}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-page transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold text-navy w-5 text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.productId, item.qty + 1)}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-page transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.productId)}
                className="text-red-400 hover:text-red-600 transition-colors p-1 shrink-0"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={() => { if (confirm("Clear all items?")) clearQuote(); }}
            className="text-xs text-text-muted hover:text-red-500 transition-colors mt-2"
          >
            Clear all items
          </button>
        </div>

        {/* ── Contact form ── */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4 sticky top-20"
          >
            <h2 className="font-bold text-navy text-lg">Your Details</h2>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1">
                Full Name *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Aisha Bello"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1">
                WhatsApp / Phone *
              </label>
              <input
                name="phone"
                required
                type="tel"
                placeholder="e.g. 08022932216"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1">
                Business Name <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <input
                name="businessName"
                placeholder="e.g. Bello Salon"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1">
                Additional Message <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                name="message"
                rows={3}
                placeholder="Any special requests, delivery location, etc."
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white resize-none"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-navy-mid transition-colors disabled:opacity-60"
            >
              {isPending ? "Sending..." : "📨 Send Quote Request"}
            </button>

            <p className="text-xs text-text-muted text-center">
              We'll contact you on WhatsApp or by phone within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
