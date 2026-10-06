import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getStoreSettings } from "@/lib/data/storefront";
import { ChevronRight, ShieldCheck, Truck, PackageCheck, AlertCircle, Tag } from "lucide-react";
import ProductMediaGallery from "./MediaGallery";

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

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const waNumber = (settings["site.whatsapp_number"] ?? "2348022932216").replace(/\D/g, "");

  const priceKobo = product.priceKobo;
  const compareAtKobo = product.compareAtKobo;
  const stockQty = product.stockQty;
  const priceMode = product.priceMode;
  const showPrice = priceMode === "show" && priceKobo != null;
  const priceNaira = priceKobo ? priceKobo / 100 : null;
  const compareNaira = compareAtKobo ? compareAtKobo / 100 : null;
  const isOutOfStock = product.stockStatus === "out_of_stock" || (product.stockStatus === "in_stock" && stockQty <= 0);
  const specs = Array.isArray(product.specs) ? product.specs as { name: string; value: string }[] : [];

  const waMessage = `Hi, I want to inquire about:\n*${product.name}*\n${showPrice ? `Price: ₦${priceNaira!.toLocaleString()}` : ""}\n${settings["site.url"] ?? "https://okiki-store.vercel.app"}/products/${product.slug}`;

  return (
    <>
      {/* ── Breadcrumb ─────────────────────────────────────────────────────────── */}
      <div className="bg-navy border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center text-sm text-white/60">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white font-medium truncate max-w-[180px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT: MEDIA GALLERY */}
          <ProductMediaGallery
            media={product.media}
            productName={product.name}
            cloudName={cloudName}
          />

          {/* RIGHT: INFO */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isFeatured && (
                <span className="bg-gold/20 text-gold-dark text-xs font-bold px-3 py-1 rounded-full border border-gold/30">⭐ Featured</span>
              )}
              {product.isHotDeal && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200">🔥 Hot Deal</span>
              )}
              {product.isNewArrival && (
                <span className="bg-blue/10 text-blue text-xs font-bold px-3 py-1 rounded-full border border-blue/20">🆕 New Arrival</span>
              )}
            </div>

            <h1 className="font-display font-bold text-3xl md:text-4xl text-navy mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              {showPrice ? (
                <>
                  <span className="text-3xl font-bold text-blue">₦{priceNaira!.toLocaleString()}</span>
                  {compareNaira && compareNaira > priceNaira! && (
                    <span className="text-lg text-text-secondary line-through">₦{compareNaira.toLocaleString()}</span>
                  )}
                  {compareNaira && compareNaira > priceNaira! && (
                    <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">
                      {Math.round((1 - priceNaira! / compareNaira) * 100)}% OFF
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

            {/* CTA Box */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <><AlertCircle className="h-5 w-5 text-red-500" /><span className="font-semibold text-red-500">Out of Stock</span></>
                ) : (
                  <><PackageCheck className="h-5 w-5 text-green-600" /><span className="font-semibold text-green-600">
                    {stockQty > 0 && stockQty < 5 ? `Only ${stockQty} left!` : "In Stock"}
                  </span></>
                )}
              </div>

              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:-translate-y-0.5"
                }`}
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {isOutOfStock ? "Currently Unavailable" : "Order via WhatsApp"}
              </a>

              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, I have a question about: *${product.name}*`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-border hover:border-navy text-navy hover:bg-page transition-colors"
              >
                💬 Ask a Question
              </a>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: <ShieldCheck className="w-5 h-5 text-gold" />, text: product.warrantyNote ?? "Quality Guaranteed" },
                { icon: <Truck className="w-5 h-5 text-gold" />, text: product.deliveryNote ?? "Fast Delivery" },
                { icon: <Tag className="w-5 h-5 text-gold" />, text: "Best Price" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 bg-page border border-border rounded-xl p-3 text-center">
                  {icon}
                  <span className="text-[11px] text-text-secondary leading-tight">{text}</span>
                </div>
              ))}
            </div>

            {/* Specs */}
            {specs.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-xl text-navy mb-4 border-b border-border pb-2">Specifications</h3>
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
