import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedProducts,
  getNewArrivals,
  getStoreSettings,
} from "@/lib/data/storefront";
import ProductCard from "@/components/store/ProductCard";
import MediaSlider from "@/components/store/MediaSlider";
import InfiniteTrustStrip from "@/components/store/InfiniteTrustStrip";

export const metadata: Metadata = { title: "Home" };

/* ── Hero per-slide text defaults ────────────────────────────────────────── */
const HERO_DEFAULTS = [
  { headline: "Quality Products. Reliable Service. Trusted Dealer." },
  { headline: "Equip your salon from the first chair to the last mirror." },
  { headline: "Top-tier Electronics for a Modern Home." },
  { headline: "Power for your home and business." },
  { headline: "Light up your content with Premium Gear." },
];

/* ── Category tile content ───────────────────────────────────────────────── */
const TILES = [
  { slot: "tile-salon", href: "/categories/salon-beauty", label: "Salon & Beauty", desc: "Chairs, dryers, mirrors & more" },
  { slot: "tile-home", href: "/categories/home-electronics", label: "Home Electronics", desc: "TVs, fans, fridges & more" },
  { slot: "tile-power", href: "/categories/power-generators", label: "Power & Generators", desc: "Generators, inverters & more" },
  { slot: "tile-creator", href: "/categories/creator-gear", label: "Creator Gear", desc: "Lights, tripods & accessories" },
];

/* ── Bundle card content ─────────────────────────────────────────────────── */
const BUNDLES = [
  { slot: "bundle-starter", href: "/bundles/starter", label: "Starter Bundle", desc: "Just starting out? This bundle gets you up and running fast.", highlight: false },
  { slot: "bundle-standard", href: "/bundles/standard", label: "Standard Bundle", desc: "The full professional setup for a busy, thriving salon.", highlight: true },
  { slot: "bundle-premium", href: "/bundles/premium", label: "Premium Bundle", desc: "Top-tier equipment for the complete luxury experience.", highlight: false },
];

export default async function HomePage() {
  const [featuredProducts, newArrivals, settings] = await Promise.all([
    getFeaturedProducts(4),
    getNewArrivals(6), // Fetch 6 for latest products
    getStoreSettings(),
  ]);

  const waNumber = (settings["site.whatsapp_number"] ?? "2348022932216").replace(/\D/g, "");
  const storeAddress = settings["site.address"] ?? "Dugbe Alawo, Opposite Kamiluze Phase One, Ibadan";
  const phone1 = settings["site.phone1"] ?? "+2348022932216";
  const phone2 = settings["site.phone2"] ?? "+2348037283936";
  const cityLabel = storeAddress.split(",").pop()?.trim() ?? "Ibadan";

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section aria-label="Welcome to OKIKI Electronics Store" className="relative">
        <MediaSlider 
          slot="home-hero" 
          defaults={HERO_DEFAULTS}
          overlayTop={
            <div className="mb-6 inline-block bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold/20">
              Dugbe Alawo, Ibadan
            </div>
          }
          overlayBottom={
            <>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-10 drop-shadow mt-4">
                Your one-stop shop for salon & beauty equipment, home electronics, generators, and creator gear in Ibadan, Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
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
                  className="border-2 border-white/40 hover:border-gold hover:text-gold text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </>
          }
        />
        
        {/* SVG Curve overlapping the next section */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-40 pointer-events-none transform translate-y-px">
          <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V73.23C200,105.12,400,120,600,120s400-14.88,600-46.77V0Z" className="fill-page"></path>
          </svg>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
            Shop by Category
          </h2>
          <p className="text-text-secondary max-w-md mx-auto text-sm md:text-base">
            Everything you need, organised by what matters to you.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TILES.map((tile) => (
            <Link
              key={tile.slot}
              href={tile.href}
              className="block group hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl rounded-2xl"
            >
              <MediaSlider slot={tile.slot} className="rounded-2xl">
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end p-5 md:p-6 z-20">
                  <p className="font-display font-bold text-white text-lg md:text-2xl drop-shadow-lg translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                    {tile.label}
                  </p>
                  <p className="text-white/80 text-xs md:text-sm mt-1 drop-shadow opacity-90">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
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

      {/* ── LATEST PRODUCTS ──────────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">
              Latest Products
            </h2>
            <Link href="/shop" className="text-sm font-semibold text-blue hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}

      {/* ── EQUIP YOUR SALON ─────────────────────────────────────────────────── */}
      <section className="bg-navy-mid py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none transform -translate-y-px rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-6 md:h-12 text-page fill-current">
            <path d="M0,120 Q600,0 1200,120 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center text-white mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Equip Your Salon
            </h2>
            <p className="text-white/80 max-w-lg mx-auto text-lg">
              Ready-to-go bundles for every type of salon. Choose your tier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {BUNDLES.map((bundle) => (
              <div
                key={bundle.slot}
                className={`relative rounded-3xl overflow-hidden bg-navy ${
                  bundle.highlight
                    ? "border-2 border-gold shadow-[0_0_30px_rgba(201,150,12,0.3)] transform md:-translate-y-4"
                    : "border border-white/10"
                }`}
              >
                {bundle.highlight && (
                  <div className="absolute top-4 right-4 z-30 bg-gold text-navy text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                )}
                <Link href={bundle.href} className="block group">
                  <MediaSlider slot={bundle.slot} className="rounded-3xl h-[450px]">
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end p-8 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <p className="font-display font-bold text-white text-2xl drop-shadow-lg mb-2">
                        {bundle.label}
                      </p>
                      <p className="text-white/80 text-sm text-center mb-6 drop-shadow max-w-[240px]">
                        {bundle.desc}
                      </p>
                      <span className="border border-white/60 text-white font-semibold text-sm px-8 py-3 rounded-full pointer-events-auto group-hover:bg-white group-hover:text-navy transition-colors shadow-lg">
                        View Details
                      </span>
                    </div>
                  </MediaSlider>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFINITE SCROLL TRUST STRIP ──────────────────────────────────────── */}
      <InfiniteTrustStrip />

      {/* ── VISIT OUR STORE ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <MediaSlider slot="visit-us" className="rounded-3xl shadow-xl overflow-hidden group">
          <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center justify-center p-8 md:p-16 bg-black/60 md:bg-black/50 backdrop-blur-[2px]">
            <div className="text-center">
              <p className="text-white/80 font-semibold tracking-widest uppercase text-sm mb-2 drop-shadow">
                Visit Us In-Store
              </p>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                OKIKI Electronics Store
              </h2>
              
              <div className="inline-flex flex-col items-center gap-4">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(storeAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-page text-navy font-bold px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-xl flex items-center gap-2"
                >
                  Open in Google Maps →
                </a>
                <p className="text-white/90 text-sm md:text-base font-medium drop-shadow-md max-w-md mx-auto mt-2">
                  📍 {storeAddress}
                </p>
              </div>
            </div>
          </div>
        </MediaSlider>
      </section>

      <div className="h-16 md:h-0" aria-hidden />
    </>
  );
}
