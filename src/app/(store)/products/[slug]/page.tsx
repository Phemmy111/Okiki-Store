import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getStoreSettings } from "@/lib/data/storefront";
import { buildCloudinaryUrl } from "@/lib/cloudinary-client";
import { ChevronRight, ShieldCheck, Truck, PackageCheck, AlertCircle } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description?.substring(0, 160) ?? undefined,
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const settings = await getStoreSettings();

  if (!product || !product.isPublished) notFound();

  const primaryMedia = product.media[0] ?? null;
  const secondaryMedia = product.media.slice(1);
  const waNumber = (settings["site.whatsapp_number"] ?? "2348022932216").replace(/\D/g, "");

  // Column names from schema: priceKobo, compareAtKobo, stockQty, priceMode
  const priceKobo = product.priceKobo;
  const compareAtKobo = product.compareAtKobo;
  const stockQty = product.stockQty;
  const priceMode = product.priceMode; // "show" | "call" | "wholesale"
  const showPrice = priceMode === "show" && priceKobo != null;
  const priceNaira = priceKobo ? priceKobo / 100 : null;
  const compareNaira = compareAtKobo ? compareAtKobo / 100 : null;
  const isOutOfStock = product.stockStatus === "out_of_stock" || (product.stockStatus === "in_stock" && stockQty <= 0);

  const specs = Array.isArray(product.specs) ? product.specs as { name: string; value: string }[] : [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-navy border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center text-sm text-white/60">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* LEFT: MEDIA */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              {primaryMedia ? (
                <Image
                  src={buildCloudinaryUrl(primaryMedia.publicId, { format: "auto", quality: "auto", crop: "pad" })}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-secondary">No image</div>
              )}
            </div>
            {secondaryMedia.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {secondaryMedia.map((m) => (
                  <div key={m.id} className="aspect-square relative bg-white border border-border rounded-xl overflow-hidden">
                    <Image
                      src={buildCloudinaryUrl(m.publicId, { format: "auto", quality: "auto", crop: "pad" })}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 1024px) 25vw, 12vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: INFO */}
          <div className="flex flex-col">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-navy mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              {showPrice ? (
                <>
                  <span className="text-3xl font-bold text-blue">₦{priceNaira!.toLocaleString()}</span>
                  {compareNaira && compareNaira > priceNaira! && (
                    <span className="text-lg text-text-secondary line-through">
                      ₦{compareNaira.toLocaleString()}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-2xl font-bold text-blue">Price on request</span>
              )}
            </div>

            {product.description && (
              <p className="text-text-secondary mb-8 leading-relaxed">{product.description}</p>
            )}

            {/* CTA */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                {isOutOfStock ? (
                  <><AlertCircle className="h-5 w-5 text-red-500" /><span className="font-semibold text-red-500">Out of Stock</span></>
                ) : (
                  <><PackageCheck className="h-5 w-5 text-green-600" /><span className="font-semibold text-green-600">
                    {stockQty > 0 && stockQty < 5 ? `Only ${stockQty} left!` : "In Stock"}
                  </span></>
                )}
              </div>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, I want to order:\n*${product.name}*\n${showPrice ? `Price: ₦${priceNaira!.toLocaleString()}` : ""}\n${settings["site.url"] ?? "http://localhost:3000"}/products/${product.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center py-4 rounded-xl font-bold text-lg transition-all ${isOutOfStock ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-navy hover:bg-navy-mid text-white shadow-md hover:-translate-y-0.5"}`}
                onClick={(e) => isOutOfStock && e.preventDefault()}
              >
                {isOutOfStock ? "Currently Unavailable" : "Order via WhatsApp"}
              </a>
            </div>

            {/* Specs */}
            {specs.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-xl text-navy mb-4 border-b border-border pb-2">
                  Specifications
                </h3>
                <dl className="divide-y divide-border text-sm">
                  {specs.map((s) => (
                    <div key={s.name} className="py-3 flex justify-between gap-4">
                      <dt className="font-medium text-text-secondary capitalize">{s.name}</dt>
                      <dd className="text-navy text-right font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
