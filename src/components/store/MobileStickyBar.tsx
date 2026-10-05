"use client";

import Link from "next/link";
import { Phone, MessageCircle, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const WA_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348022932216";
const PHONE_NUMBER = "+2348022932216";

interface MobileStickyBarProps {
  quoteCount?: number;
}

export default function MobileStickyBar({ quoteCount = 0 }: MobileStickyBarProps) {
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
          aria-label={`Quote list${quoteCount > 0 ? ` — ${quoteCount} items` : ""}`}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {quoteCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                aria-hidden
              >
                {quoteCount > 9 ? "9+" : quoteCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">
            Quote{quoteCount > 0 ? ` (${quoteCount})` : ""}
          </span>
        </Link>
      </div>

      {/* Safe area spacing for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </div>
  );
}
