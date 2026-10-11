"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildCloudinaryUrl } from "@/lib/cloudinary-client";
import { X, ExternalLink, ShieldCheck, Truck, Eye } from "lucide-react";

export type BundleProduct = {
  id: number;
  name: string;
  slug: string;
  priceKobo: number | null;
  compareAtKobo: number | null;
  priceMode: string;
  description: string | null;
  warrantyNote: string | null;
  deliveryNote: string | null;
  specs: { label: string; value: string }[];
  media: { publicId: string; type: string }[];
  primaryMedia: { publicId: string } | null;
};

export type BundleItem = {
  id: number;
  qty: number;
  product: BundleProduct | null;
};

export default function BundleItemsList({ items }: { items: BundleItem[] }) {
  const [selectedItem, setSelectedItem] = useState<BundleItem | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Reset active image index when selected item changes
  useEffect(() => {
    setActiveMediaIndex(0);
  }, [selectedItem]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!items || items.length === 0) {
    return <p className="text-text-secondary text-sm">No items in this bundle.</p>;
  }

  const activeProduct = selectedItem?.product;
  const productMediaList = activeProduct?.media ?? [];
  const currentPublicId =
    productMediaList[activeMediaIndex]?.publicId ||
    activeProduct?.primaryMedia?.publicId ||
    null;

  return (
    <>
      {/* ── Items Grid ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {items.map((item) => {
          const img = item.product?.primaryMedia
            ? buildCloudinaryUrl(item.product.primaryMedia.publicId, {
                format: "auto",
                quality: "auto",
                crop: "pad",
              })
            : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item)}
              className="flex items-center gap-4 bg-card border border-border hover:border-gold hover:shadow-md rounded-xl p-4 transition-all text-left group cursor-pointer relative"
            >
              <div className="h-16 w-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-white border border-border group-hover:border-gold/50 transition-colors">
                {img ? (
                  <Image
                    src={img}
                    alt={item.product?.name ?? "Product"}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">📦</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy text-sm truncate group-hover:text-gold-dark transition-colors">
                  {item.product?.name ?? "Product"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-page px-2 py-0.5 rounded border border-border text-navy font-bold">
                    Qty: {item.qty}
                  </span>
                  <span className="text-[11px] text-text-muted flex items-center gap-1 group-hover:text-gold transition-colors">
                    <Eye className="w-3 h-3" /> View details
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Product Details Modal ──────────────────────────────────────────────── */}
      {selectedItem && activeProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border relative p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-navy p-2 rounded-full hover:bg-page transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Image & Thumbnails */}
              <div className="space-y-3">
                <div className="w-full h-64 sm:h-72 relative rounded-xl overflow-hidden bg-page border border-border">
                  {currentPublicId ? (
                    <Image
                      src={buildCloudinaryUrl(currentPublicId, {
                        format: "auto",
                        quality: "auto",
                        crop: "pad",
                      })}
                      alt={activeProduct.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 100vw, 600px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                  )}
                </div>

                {/* Additional Media Thumbnails */}
                {productMediaList.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {productMediaList.map((m, idx) => (
                      <button
                        key={m.publicId}
                        type="button"
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`h-14 w-14 relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          activeMediaIndex === idx ? "border-gold shadow" : "border-border opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={buildCloudinaryUrl(m.publicId, {
                            width: 80,
                            height: 80,
                            crop: "fill",
                          })}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Bundle Qty Badge */}
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="bg-gold/15 text-gold-dark text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Included in Bundle (Qty: {selectedItem.qty})
                  </span>
                  {activeProduct.priceMode === "show" && activeProduct.priceKobo && (
                    <span className="text-sm font-bold text-navy">
                      ₦{(activeProduct.priceKobo / 100).toLocaleString()} value
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-navy">
                  {activeProduct.name}
                </h3>
              </div>

              {/* Description */}
              {activeProduct.description && (
                <div className="bg-page rounded-xl p-4 border border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Description
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                    {activeProduct.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {activeProduct.specs && activeProduct.specs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Specifications
                  </h4>
                  <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-sm">
                    {activeProduct.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between px-4 py-2 bg-white">
                        <span className="text-text-muted">{spec.label}</span>
                        <span className="font-medium text-navy">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty & Delivery Info */}
              {(activeProduct.warrantyNote || activeProduct.deliveryNote) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {activeProduct.warrantyNote && (
                    <div className="flex items-center gap-2 text-navy bg-gold/10 p-3 rounded-xl border border-gold/20">
                      <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
                      <span>{activeProduct.warrantyNote}</span>
                    </div>
                  )}
                  {activeProduct.deliveryNote && (
                    <div className="flex items-center gap-2 text-navy bg-blue/10 p-3 rounded-xl border border-blue/20">
                      <Truck className="w-4 h-4 text-blue shrink-0" />
                      <span>{activeProduct.deliveryNote}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {activeProduct.slug && (
                  <Link
                    href={`/products/${activeProduct.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-mid text-white font-semibold py-3 px-5 rounded-xl text-sm transition-colors text-center"
                  >
                    <span>View Dedicated Product Page</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="sm:w-32 border border-border hover:bg-page text-navy font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
