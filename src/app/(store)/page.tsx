import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
};

// ── Static data for Phase 1 — Phase 3 wires these to the database ─────────────

const CATEGORIES = [
  {
    name: "Salon & Beauty",
    slug: "salon-beauty",
    emoji: "💄",
    desc: "Chairs, dryers, wash basins, styling mirrors & more",
    color: "from-pink-50 to-rose-50 border-pink-100",
    textColor: "text-rose-700",
  },
  {
    name: "Home Electronics",
    slug: "home-electronics",
    emoji: "🏠",
    desc: "Fans, blenders, microwaves, hand dryers & more",
    color: "from-blue-50 to-indigo-50 border-blue-100",
    textColor: "text-blue-700",
  },
  {
    name: "Power & Generators",
    slug: "power-generators",
    emoji: "⚡",
    desc: "Reliable power solutions for home & business",
    color: "from-amber-50 to-yellow-50 border-amber-100",
    textColor: "text-amber-700",
  },
  {
    name: "Creator Gear",
    slug: "creator-gear",
    emoji: "🎥",
    desc: "Ring lights, phone tripod stands & accessories",
    color: "from-purple-50 to-violet-50 border-purple-100",
    textColor: "text-purple-700",
  },
];

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348022932216";

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative bg-navy overflow-hidden"
        aria-label="Welcome to OKIKI Electronics Store"
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          {/* Eyebrow */}
          <span className="inline-block bg-gold/20 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-gold/30">
            Dugbe Alawo, Ibadan
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight text-balance mb-5">
            Quality Products.{" "}
            <span className="text-gold">Reliable Service.</span>{" "}
            Trusted Dealer.
          </h1>

          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Your one-stop shop for salon & beauty equipment, home electronics,
            generators, and creator gear in Ibadan, Nigeria.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="bg-gold hover:bg-gold-light text-navy font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              Shop Now
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 hover:border-gold hover:text-gold text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-page" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} aria-hidden />
      </section>

      {/* ── CATEGORY TILES ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
            Shop by Category
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Everything you need — from salon setups to home appliances.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={`
                group relative bg-gradient-to-br ${cat.color} border rounded-2xl p-5 sm:p-6 text-center
                hover:shadow-lg hover:-translate-y-1 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
              `}
            >
              <span className="text-4xl mb-3 block" aria-hidden>
                {cat.emoji}
              </span>
              <h3
                className={`font-bold ${cat.textColor} text-sm sm:text-base mb-1 group-hover:underline`}
              >
                {cat.name}
              </h3>
              <p className="text-xs text-text-secondary leading-snug hidden sm:block">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

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
            {[
              {
                name: "Starter",
                emoji: "🪑",
                desc: "Just starting out? This bundle gets you up and running.",
              },
              {
                name: "Standard",
                emoji: "✂️",
                desc: "The full professional setup for a busy salon.",
                highlight: true,
              },
              {
                name: "Premium",
                emoji: "👑",
                desc: "Top-tier equipment for the complete luxury experience.",
              },
            ].map((bundle) => (
              <div
                key={bundle.name}
                className={`rounded-2xl p-6 text-center ${
                  bundle.highlight
                    ? "bg-gold text-navy"
                    : "bg-white/10 text-white border border-white/20"
                }`}
              >
                <span className="text-3xl mb-3 block" aria-hidden>
                  {bundle.emoji}
                </span>
                <h3 className="font-display font-bold text-xl mb-2">
                  {bundle.name} Bundle
                </h3>
                <p
                  className={`text-sm mb-4 ${bundle.highlight ? "text-navy/80" : "text-white/70"}`}
                >
                  {bundle.desc}
                </p>
                <Link
                  href="/bundles"
                  className={`inline-block font-semibold text-sm px-5 py-2 rounded-full transition-colors ${
                    bundle.highlight
                      ? "bg-navy text-white hover:bg-navy-mid"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                >
                  Request Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────────── */}
      {/* Phase 5: only admin-enabled claims will appear. Static for now. */}
      <section className="border-y border-border bg-card" aria-label="Why choose OKIKI">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: "✅", label: "Original Products" },
              { icon: "🚚", label: "Swift Delivery" },
              { icon: "💰", label: "Best Prices" },
              { icon: "🤝", label: "Wholesale Available" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <span className="text-sm font-semibold text-navy">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISIT OUR STORE ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gold-pale border border-gold/20 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Visit Our Store
              </h2>
              <p className="text-text-secondary mb-2">
                📍{" "}
                <span className="font-medium text-navy">
                  Dugbe Alawo, Opposite Kamiluze Phase One, Ibadan
                </span>
              </p>
              <p className="text-text-secondary text-sm mb-6">
                We are open Mon–Sat. Walk in or call ahead.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+2348022932216"
                  className="flex items-center justify-center gap-2 bg-navy hover:bg-navy-mid text-white font-semibold px-5 py-3 rounded-full transition-colors"
                >
                  📞 +234 802 293 2216
                </a>
                <a
                  href="tel:+2348037283936"
                  className="flex items-center justify-center gap-2 bg-navy hover:bg-navy-mid text-white font-semibold px-5 py-3 rounded-full transition-colors"
                >
                  📞 +234 803 728 3936
                </a>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden bg-border h-48 md:h-56 flex items-center justify-center">
              {/* Phase 5 admin settings will provide a real Google Maps embed URL */}
              <p className="text-text-muted text-sm text-center px-4">
                Map will appear here once configured in admin settings.
                <br />
                <a
                  href="https://maps.google.com/?q=Dugbe+Alawo+Ibadan+Nigeria"
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

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-16 md:h-0" aria-hidden />
    </>
  );
}
