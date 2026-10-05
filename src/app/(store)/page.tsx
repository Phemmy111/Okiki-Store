import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedProducts,
  getNewArrivals,
  getStoreSettings,
  getCategories,
} from "@/lib/data/storefront";
import ProductCard from "@/components/store/ProductCard";
import MediaSlider from "@/components/store/MediaSlider";

export const metadata: Metadata = { title: "Home" };

/* ── Hero per-slide text defaults ────────────────────────────────────────── */
const HERO_DEFAULTS = [
  {
    headline: "Quality Products. Reliable Service. Trusted Dealer.",
    subtext:
      "Your one-stop shop for salon & beauty equipment, home electronics, generators, and creator gear in Nigeria.",
    btnLabel: "Shop Now",
    btnUrl: "/shop",
  },
  {
    headline: "Equip your salon from the first chair to the last mirror.",
    subtext:
      "Salon chairs, dryers, wash basins, styling mirrors and more.",
    btnLabel: "Shop Salon & Beauty",
    btnUrl: "/categories/salon-beauty",
  },
  {
    headline: "Power for your home and business.",
    subtext:
      "Generators, fans, blenders, microwaves and more.",
    btnLabel: "Shop Power & Generators",
    btnUrl: "/categories/power-generators",
  },
  {
    headline: "Light up your content.",
    subtext:
      "Ring lights, phone tripod stands and creator accessories.",
    btnLabel: "Shop Creator Gear",
    btnUrl: "/categories/creator-gear",
  },
];

/* ── Category tile content ───────────────────────────────────────────────── */
const TILES = [
  {
    slot: "tile-salon",
    href: "/categories/salon-beauty",
    label: "Salon & Beauty",
    desc: "Chairs, dryers, mirrors & more",
  },
  {
    slot: "tile-home",
    href: "/categories/home-electronics",
    label: "Home Electronics",
    desc: "TVs, fans, fridges & more",
  },
  {
    slot: "tile-power",
    href: "/categories/power-generators",
    label: "Power & Generators",
    desc: "Generators, inverters & more",
  },
  {
    slot: "tile-creator",
    href: "/categories/creator-gear",
    label: "Creator Gear",
    desc: "Lights, tripods & accessories",
  },
];

/* ── Bundle card content ─────────────────────────────────────────────────── */
const BUNDLES = [
  {
    slot: "bundle-starter",
    href: "/bundles/starter",
    label: "Starter Bundle",
    desc: "Just starting out? This bundle gets you up and running fast.",
    highlight: false,
  },
  {
    slot: "bundle-standard",
    href: "/bundles/standard",
    label: "Standard Bundle",
    desc: "The full professional setup for a busy, thriving salon.",
    highlight: true,
  },
  {
    slot: "bundle-premium",
    href: "/bundles/premium",
    label: "Premium Bundle",
    desc: "Top-tier equipment for the complete luxury experience.",
    highlight: false,
  },
];

export default async function HomePage() {
  const [featuredProducts, newArrivals, settings] = await Promise.all([
    getFeaturedProducts(4),
    getNewArrivals(4),
    getStoreSettings(),
  ]);

  const waNumber = (settings["site.whatsapp_number"] ?? "2348022932216").replace(/\D/g, "");
  const storeAddress =
    settings["site.address"] ?? "Dugbe Alawo, Opposite Kamiluze Phase One, Ibadan";
  const phone1 = settings["site.phone1"] ?? "+2348022932216";
  const phone2 = settings["site.phone2"] ?? "+2348037283936";
  const cityLabel = storeAddress.split(",").pop()?.trim() ?? "Ibadan";

  const trustClaims = [
    { key: "trust.original_products", icon: "✅", label: "Original Products" },
    { key: "trust.swift_delivery",    icon: "🚚", label: "Swift Delivery" },
    { key: "trust.best_prices",       icon: "💰", label: "Best Prices" },
    { key: "trust.wholesale",         icon: "🤝", label: "Wholesale Available" },
    { key: "trust.warranty",          icon: "🛡️", label: "Warranty Support" },
  ].filter((c) => settings[c.key] === "true");

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section aria-label="Welcome to OKIKI Electronics Store">
        <MediaSlider slot="home-hero" defaults={HERO_DEFAULTS}>
          {/* The pill + Shop Now + WhatsApp buttons are always visible above the
              animated slide text. They never change as slides rotate.            */}
          <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-end pb-32 px-4 z-30">
            <span className="mb-6 inline-block bg-gold/20 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold/30">
              {cityLabel}
            </span>
            {/* Buttons below the animated headline / subtext */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="bg-gold hover:bg-gold-light text-navy font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Shop Now
              </Link>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white/40 hover:border-gold hover:text-gold text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </MediaSlider>
      </section>

      {/* ── SHOP BY CATEGORY ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
            Shop by Category
          </h2>
          <p className="text-text-secondary max-w-md mx-auto text-sm md:text-base">
            Everything you need, organised by what matters to you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TILES.map((tile) => (
            <Link
              key={tile.slot}
              href={tile.href}
              className="block group hover:-translate-y-1 transition-transform duration-300"
            >
              <MediaSlider slot={tile.slot} className="rounded-2xl">
                {/* Text sits above the background and slides. Always visible. */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end p-4 z-20">
                  <p className="font-display font-bold text-white text-lg md:text-xl drop-shadow-lg
                                translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                    {tile.label}
                  </p>
                  <p className="text-white/80 text-xs mt-0.5 drop-shadow">
                    {tile.desc}
                  </p>
                </div>
              </MediaSlider>
            </Link>
          ))}
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
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
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
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}

      {/* ── EQUIP YOUR SALON ─────────────────────────────────────────────────── */}
      <section className="bg-navy-mid py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Equip Your Salon
            </h2>
            <p className="text-white/70 max-w-md mx-auto">
              Ready-to-go bundles for every type of salon. Choose your tier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BUNDLES.map((bundle) => (
              <div
                key={bundle.slot}
                className={`relative rounded-2xl overflow-hidden ${
                  bundle.highlight
                    ? "border-2 border-gold shadow-[0_0_20px_rgba(201,150,12,0.35)]"
                    : ""
                }`}
              >
                {bundle.highlight && (
                  <div className="absolute top-3 right-3 z-30 bg-gold text-navy text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}
                <Link href={bundle.href} className="block">
                  <MediaSlider slot={bundle.slot} className="rounded-2xl">
                    {/* Bundle text — always visible over the background */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end p-6 z-20">
                      <p className="font-display font-bold text-white text-xl drop-shadow-lg">
                        {bundle.label}
                      </p>
                      <p className="text-white/80 text-sm text-center mt-1 drop-shadow max-w-[200px]">
                        {bundle.desc}
                      </p>
                      <span className="mt-4 border border-white/60 text-white font-semibold text-sm px-5 py-2 rounded-full pointer-events-auto hover:bg-white/20 transition-colors">
                        Request Quote
                      </span>
                    </div>
                  </MediaSlider>
                </Link>
              </div>
            ))}
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
        <div className="bg-gold-pale border border-gold/20 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Visit Our Store
              </h2>
              <p className="text-text-secondary mb-2">
                📍 <span className="font-medium text-navy">{storeAddress}</span>
              </p>
              <p className="text-text-secondary text-sm mb-6">
                Open Mon–Sat. Walk in or call ahead.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${phone1}`}
                  className="flex items-center justify-center gap-2 bg-navy hover:bg-navy-mid text-white font-semibold px-5 py-3 rounded-full transition-colors"
                >
                  📞 {phone1}
                </a>
                <a
                  href={`tel:${phone2}`}
                  className="flex items-center justify-center gap-2 bg-navy hover:bg-navy-mid text-white font-semibold px-5 py-3 rounded-full transition-colors"
                >
                  📞 {phone2}
                </a>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden bg-white/50 border border-gold/20 h-48 md:h-56 flex items-center justify-center">
              <p className="text-navy/60 text-sm font-medium text-center px-4">
                OKIKI Electronics Store
                <br />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(storeAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue hover:underline mt-1 inline-block"
                >
                  Open in Google Maps →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-16 md:h-0" aria-hidden />
    </>
  );
}
