"use client";
import { useQuoteStore } from "@/store/quoteStore";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348022932216";
const PHONE_NUMBER = "+2348022932216";

export default function MobileStickyBar() {
  const totalItems = useQuoteStore((s) => s.totalItems());

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-2px_10px_0_rgb(0,0,0,0.08)]"
      role="navigation"
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-3 divide-x divide-border">
        {/* Call */}
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex flex-col items-center gap-1 py-3 text-navy hover:bg-page transition-colors active:bg-border"
          aria-label="Call us"
        >
          <Phone className="h-5 w-5" aria-hidden />
          <span className="text-[10px] font-semibold">Call</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${WA_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-whatsapp hover:bg-page transition-colors active:bg-border"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          <span className="text-[10px] font-semibold">WhatsApp</span>
        </a>

        {/* Quote list */}
        <Link
          href="/quote"
          className="relative flex flex-col items-center gap-1 py-3 text-navy hover:bg-page transition-colors active:bg-border"
          aria-label={`Quote list${totalItems > 0 ? ` — ${totalItems} items` : ""}`}
        >
          <div className="relative">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center" aria-hidden>
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">
            Quote{totalItems > 0 ? ` (${totalItems})` : ""}
          </span>
        </Link>
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </div>
  );
}
