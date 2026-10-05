import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { buildCloudinaryUrl } from "@/lib/cloudinary-client";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    priceKobo: number | null;
    priceMode: string;
    compareAtKobo: number | null;
    stockStatus: string;
    isNewArrival: boolean;
    primaryMedia: { publicId: string } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.primaryMedia
    ? buildCloudinaryUrl(product.primaryMedia.publicId, { width: 500, height: 500, crop: "fill" })
    : "/brand/logo.jpg"; // fallback

  const hasDiscount = product.compareAtKobo && product.priceKobo && product.compareAtKobo > product.priceKobo;

  // Determine badge
  let badge = null;
  if (product.stockStatus === "out_of_stock") {
    badge = <span className="bg-danger text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Out of Stock</span>;
  } else if (product.isNewArrival) {
    badge = <span className="bg-blue text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">New</span>;
  } else if (hasDiscount) {
    badge = <span className="bg-gold text-navy text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Sale</span>;
  }

  return (
    <div className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Badges */}
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          {badge}
        </div>
      )}

      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-page flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`} className="block flex-1">
          <h3 className="text-sm font-semibold text-navy leading-snug line-clamp-2 group-hover:text-blue transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Pricing & Actions */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            {product.priceMode === "show" && product.priceKobo !== null ? (
              <div className="flex flex-col">
                {hasDiscount && (
                  <span className="text-xs text-text-muted line-through">
                    {formatPrice(product.compareAtKobo!)}
                  </span>
                )}
                <span className="text-base font-bold text-navy">
                  {formatPrice(product.priceKobo)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-gold">Ask for price</span>
            )}
          </div>

          <button
            aria-label="Add to quote list"
            className="h-8 w-8 rounded-full bg-page text-navy flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
