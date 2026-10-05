"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
} from "lucide-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const WA_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348022932216";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Salon & Beauty", href: "/categories/salon-beauty" },
  { label: "Electronics", href: "/categories/home-electronics" },
  { label: "Generators", href: "/categories/power-generators" },
  { label: "Bundles", href: "/bundles" },
  { label: "Visit Us", href: "/store" },
];

// WhatsApp SVG icon (inline — no extra dependency)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Phase 4 will wire this to Zustand quote list store
  const quoteCount: number = 0;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      {/* ── Main bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0 focus-visible:rounded-md">
            <Image
              src="/brand/logo.jpg"
              alt="OKIKI Electronics Store"
              width={100}
              height={60}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search — desktop only (Phase 3 wires up suggestions) */}
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-page text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* WhatsApp chip — desktop */}
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-whatsapp hover:bg-whatsapp-dark text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-whatsapp"
              aria-label="Chat with us on WhatsApp"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              Chat with us
            </a>

            {/* Quote list icon */}
            <Link
              href="/quote"
              className="relative p-2 rounded-full hover:bg-page transition-colors"
              aria-label={`Quote list${quoteCount > 0 ? ` — ${quoteCount} item${quoteCount !== 1 ? "s" : ""}` : ""}`}
            >
              <ShoppingBag className="h-5 w-5 text-navy" aria-hidden />
              {quoteCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  aria-hidden
                >
                  {quoteCount > 9 ? "9+" : quoteCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden sm:block text-sm font-medium text-navy hover:text-blue transition-colors px-2 py-1 rounded">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-page transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-navy" aria-hidden />
              ) : (
                <Menu className="h-5 w-5 text-navy" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category nav strip — desktop ── */}
      <div className="hidden md:block border-t border-border bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Product categories" className="flex items-center gap-1 overflow-x-auto py-0 scrollbar-hide">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white/80 hover:text-gold hover:bg-white/5 transition-colors rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile nav drawer ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-border">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-page text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          {/* Mobile nav links */}
          <nav aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-navy hover:bg-page hover:text-blue border-b border-border/50 last:border-0 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile WhatsApp */}
          <div className="px-4 py-3">
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-whatsapp-dark text-white font-semibold py-2.5 rounded-full transition-colors"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
