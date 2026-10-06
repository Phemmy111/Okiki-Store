"use client";
import { useQuoteStore } from "@/store/quoteStore";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  productId: number;
  name: string;
  slug: string;
  priceKobo: number | null;
  imagePublicId: string | null;
  variant?: "card" | "detail"; // card = icon only, detail = full button
};

export default function AddToQuoteButton({
  productId,
  name,
  slug,
  priceKobo,
  imagePublicId,
  variant = "card",
}: Props) {
  const { addItem, items } = useQuoteStore();
  const [added, setAdded] = useState(false);
  const isInQuote = items.some((i) => i.productId === productId);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId, name, slug, priceKobo, imagePublicId });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (variant === "detail") {
    return (
      <button
        onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all ${
          isInQuote
            ? "bg-gold/10 border-gold text-gold-dark"
            : "border-border hover:border-navy text-navy hover:bg-page"
        }`}
      >
        {added ? (
          <><Check className="w-4 h-4 text-green-600" /> Added to Quote!</>
        ) : isInQuote ? (
          <><ShoppingBag className="w-4 h-4" /> In Your Quote</>
        ) : (
          <><ShoppingBag className="w-4 h-4" /> Add to Quote</>
        )}
      </button>
    );
  }

  // card variant — icon button
  return (
    <button
      onClick={handleAdd}
      aria-label="Add to quote list"
      className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
        added
          ? "bg-green-500 text-white"
          : isInQuote
          ? "bg-gold text-white"
          : "bg-page text-navy hover:bg-gold hover:text-white"
      }`}
    >
      {added ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingBag className="h-4 w-4" />
      )}
    </button>
  );
}
