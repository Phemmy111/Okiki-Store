import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Salon & Beauty", href: "/categories/salon-beauty" },
    { label: "Home Electronics", href: "/categories/home-electronics" },
    { label: "Power & Generators", href: "/categories/power-generators" },
    { label: "Creator Gear", href: "/categories/creator-gear" },
    { label: "Bundles", href: "/bundles" },
  ],
  "Customer Service": [
    { label: "Bag", href: "/quote" },
    { label: "Bulk Orders", href: "/quote?type=wholesale" },
    { label: "Visit Our Store", href: "/store" },
    { label: "Contact Us", href: "/store#contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Return Policy", href: "/returns" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/brand/logo.jpg"
                alt="OKIKI Electronics Store"
                width={90}
                height={54}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Quality Products. Reliable Service. Trusted Dealer.
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              Your one-stop shop for home electronics and salon equipment in Ibadan, Nigeria.
            </p>

            {/* Contact info */}
            <div className="mt-5 space-y-2">
              <a
                href="tel:+2348022932216"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                +234 802 293 2216
              </a>
              <a
                href="tel:+2348037283936"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                +234 803 728 3936
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
                <span>Dugbe Alawo, Opp. Kamiluze Phase 1, Ibadan</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/50">
            © {year} Okikiola Electronics Store. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Dugbe Alawo, Ibadan, Oyo State, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}

