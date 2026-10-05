import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedProducts,
  getNewArrivals,
  getStoreSettings,
} from "@/lib/data/storefront";
import ProductCard from "@/components/store/ProductCard";
import MediaSlider from "@/components/store/MediaSlider";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const [featuredProducts, newArrivals, settings] = await Promise.all([
    getFeaturedProducts(4),
    getNewArrivals(4),
    getStoreSettings(),
  ]);

  const waNumber = settings["site.whatsapp_number"] ?? "2348022932216";
  const storeAddress = settings["site.address"] ?? "Dugbe Alawo, Opposite Kamiluze Phase One, Ibadan";
  const phone1 = settings["site.phone1"] ?? "+2348022932216";
  const phone2 = settings["site.phone2"] ?? "+2348037283936";

  const trustClaims = [
    { key: "trust.original_products", icon: "✅", label: "Original Products" },
    { key: "trust.swift_delivery", icon: "🚚", label: "Swift Delivery" },
    { key: "trust.best_prices", icon: "💰", label: "Best Prices" },
    { key: "trust.wholesale", icon: "🤝", label: "Wholesale Available" },
    { key: "trust.warranty", icon: "🛡️", label: "Warranty Support" },
  ].filter(claim => settings[claim.key] === "true");

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="w-full">
        <MediaSlider slot="home-hero" />
      </section>

      {/* ── CATEGORY TILES (MEDIA SLOTS) ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/categories/salon-beauty" className="block hover:-translate-y-1 transition-transform">
            <MediaSlider slot="tile-salon" />
          </Link>
          <Link href="/categories/home-electronics" className="block hover:-translate-y-1 transition-transform">
            <MediaSlider slot="tile-home" />
          </Link>
          <Link href="/categories/power-generators" className="block hover:-translate-y-1 transition-transform">
            <MediaSlider slot="tile-power" />
          </Link>
          <Link href="/categories/creator-gear" className="block hover:-translate-y-1 transition-transform">
            <MediaSlider slot="tile-creator" />
          </Link>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">
              Featured Products
            </h2>
            <Link href="/shop" className="text-sm font-semibold text-blue hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </section>
      )}

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">
              New Arrivals
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </section>
      )}

      {/* ── EQUIP YOUR SALON BANNER ───────────────────────────────────────────── */}
      <section className="bg-navy-mid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center text-white mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Equip Your Salon
            </h2>
            <p className="text-white/70 max-w-md mx-auto">
              Ready-to-go bundles for every type of salon. Choose your tier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/bundles/starter" className="block hover:opacity-90 transition-opacity">
              <MediaSlider slot="bundle-starter" />
            </Link>
            <div className="relative group hover:opacity-90 transition-opacity rounded-2xl overflow-hidden border-2 border-gold shadow-[0_0_15px_rgba(201,150,12,0.3)]">
              <div className="absolute top-3 right-3 z-30 bg-gold text-navy text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <Link href="/bundles/standard" className="block w-full h-full">
                <MediaSlider slot="bundle-standard" />
              </Link>
            </div>
            <Link href="/bundles/premium" className="block hover:opacity-90 transition-opacity">
              <MediaSlider slot="bundle-premium" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────────── */}
      {trustClaims.length > 0 && (
        <section className="border-y border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
              {trustClaims.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5">
                  <span className="text-2xl" aria-hidden>{item.icon}</span>
                  <span className="text-sm font-semibold text-navy">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VISIT OUR STORE ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MediaSlider slot="visit-us" />
      </section>

      <div className="h-16 md:h-0" aria-hidden />
    </>
  );
}
