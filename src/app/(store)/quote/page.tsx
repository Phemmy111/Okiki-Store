"use client";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle2, UploadCloud } from "lucide-react";
import { useQuoteStore } from "@/store/quoteStore";
import { submitQuoteAction, getCloudinaryKeys } from "@/lib/actions/submit-quote";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export default function QuotePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { items, removeItem, updateQty, clearQuote } = useQuoteStore();
  const [isPending, startTransition] = useTransition();
  const [submittedName, setSubmittedName] = useState("");
  const [submittedRef, setSubmittedRef] = useState("");
  const [error, setError] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [cloudKeys, setCloudKeys] = useState<{cloudName?: string, apiKey?: string}>({});
  useEffect(() => { getCloudinaryKeys().then(setCloudKeys); }, []);

  const cartTotal = items.reduce((sum, item) => sum + (item.priceKobo || 0) * item.qty, 0);

  const makeSignature = async (callback: Function, paramsToSign: any) => {
    const res = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paramsToSign }),
    });
    const data = await res.json();
    callback(data.signature);
  };

  const openReceiptWidget = () => {
    if (typeof window === "undefined" || !(window as any).cloudinary) {
      alert("Upload widget not ready yet. Please try again in a few seconds.");
      return;
    }
    (window as any).cloudinary.createUploadWidget(
      {
        cloudName: cloudKeys.cloudName || CLOUD_NAME,
        uploadSignature: makeSignature,
        apiKey: cloudKeys.apiKey,
        resourceType: "image",
        multiple: false,
        maxFiles: 1,
        sources: ["local", "camera"],
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          setReceiptUrl(result.info.secure_url);
        }
      }
    ).open();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const customerName = fd.get("name") as string;
    
    if (receiptUrl) {
      fd.set("receiptUrl", receiptUrl);
    }

    fd.set(
      "items",
      JSON.stringify(
        items.map((i) => ({
          productId: i.productId,
          productNameSnapshot: i.name,
          productSlugSnapshot: i.slug,
          priceKoboSnapshot: i.priceKobo,
          qty: i.qty,
        }))
      )
    );

    startTransition(async () => {
      const result = await submitQuoteAction(fd);
      if (result?.error) {
        setError(result.error as string);
      } else {
        setSubmittedName(customerName);
        setSubmittedRef(result.reference as string);
        try { const stored = JSON.parse(localStorage.getItem("okiki_orders") || "[]"); stored.push(result.reference); localStorage.setItem("okiki_orders", JSON.stringify(stored)); } catch {}
        clearQuote();
      }
    });
  };

  /* ── Submitted state ──────────────────────────────────────────── */
  if (submittedName) {
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348022932216";
    const waMessage = `Hello OKIKI Store! I just submitted an order on the website. My name is *${submittedName}*. Please check it.`;

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="font-display text-2xl font-bold text-navy mb-2">
          Order Sent! (Ref: {submittedRef})
        </h1>
        <p className="text-text-secondary max-w-md mb-8">
          Thank you! We've received your request. You can notify us on WhatsApp now for an instant response, or we will reach out to you shortly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a
            href={`https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 text-white font-bold px-8 py-3 rounded-full hover:bg-green-700 transition-colors shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Notify Admin on WhatsApp
          </a>
          <Link
            href="/shop"
            className="text-navy font-bold hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ── Empty state ──────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="w-16 h-16 text-border mb-4" />
        <h1 className="font-display text-2xl font-bold text-navy mb-2">
          Your Bag is Empty
        </h1>
        <p className="text-text-secondary max-w-sm mb-6">
          Browse our products and tap the bag icon to add items to your bag.
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
        Your Bag
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
            {isLoaded && !isSignedIn && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm mb-4">
                <p className="text-blue-800 mb-2"><strong>Want to track this order across all your devices?</strong></p>
                <SignInButton mode="modal">
                  <button type="button" className="text-blue-600 font-bold hover:underline">Log in or create an account</button>
                </SignInButton>
                <span className="text-blue-800"> before checking out!</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-navy mb-1">
                Full Name *
              </label>
              <input
                name="name"
                required
                defaultValue={user?.fullName || ""}
                placeholder="e.g. Aisha Bello"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
              />
            </div>

                        <div>
              <label className="block text-sm font-semibold text-navy mb-1">
                Email Address *
              </label>
              <input
                name="email"
                required
                defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                type="email"
                placeholder="e.g. hello@example.com"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1">
                WhatsApp / Phone *
              </label>
              <input
                name="phone" required
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

            {cartTotal > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-bold text-navy text-base mb-3">Direct Bank Transfer</h3>
                <div className="bg-page rounded-xl p-4 border border-border space-y-2 mb-4">
                  <p className="text-sm text-text-secondary flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-navy">₦{(cartTotal / 100).toLocaleString()}</span>
                  </p>
                  <hr className="border-border my-2" />
                  <p className="text-sm text-text-secondary flex justify-between">
                    <span>Bank:</span>
                    <span className="font-bold text-navy">Opay</span>
                  </p>
                  <p className="text-sm text-text-secondary flex justify-between">
                    <span>Account No:</span>
                    <span className="font-bold text-navy tracking-wider">8022932216</span>
                  </p>
                  <p className="text-sm text-text-secondary flex justify-between">
                    <span>Name:</span>
                    <span className="font-bold text-navy">Babajide Remilekun</span>
                  </p>
                </div>
                
                <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
                
                <button
                  type="button"
                  onClick={openReceiptWidget}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gold text-navy font-semibold py-3 rounded-xl hover:bg-gold/5 transition-colors mb-4"
                >
                  <UploadCloud className="w-5 h-5 text-gold" />
                  {receiptUrl ? "Receipt Uploaded (Click to change)" : "Upload Payment Receipt"}
                </button>
                
                {receiptUrl && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={receiptUrl} alt="Receipt Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || (cartTotal > 0 && !receiptUrl)}
              className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-navy-mid transition-colors disabled:opacity-60"
            >
              {isPending ? "Sending..." : cartTotal > 0 ? "Complete Order" : "Submit Order"}
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












