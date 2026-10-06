"use client";
import { useQuoteStore } from "@/store/quoteStore";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function QuoteCount() {
  const totalItems = useQuoteStore((s) => s.totalItems());

  return (
    <Link
      href="/quote"
      className="relative p-2 rounded-full hover:bg-page transition-colors"
      aria-label={`Quote list${totalItems > 0 ? ` — ${totalItems} item${totalItems !== 1 ? "s" : ""}` : ""}`}
    >
      <ShoppingBag className="h-5 w-5 text-navy" aria-hidden />
      {totalItems > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          aria-hidden
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
