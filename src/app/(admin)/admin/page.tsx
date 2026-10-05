import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Overview | Admin",
};

const QUICK_CARDS = [
  {
    label: "Quote Requests",
    value: "—",
    sub: "Phase 2 — DB not connected",
    href: "/admin/quotes",
    color: "border-l-blue",
  },
  {
    label: "Products",
    value: "—",
    sub: "Phase 2 — DB not connected",
    href: "/admin/products",
    color: "border-l-gold",
  },
  {
    label: "Low / Out of Stock",
    value: "—",
    sub: "Phase 2 — DB not connected",
    href: "/admin/products?filter=low_stock",
    color: "border-l-warning",
  },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">
          Dashboard Overview
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Phase 1 scaffold — live data available after Phase 2 (database setup).
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {QUICK_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`bg-card rounded-xl border border-border border-l-4 ${card.color} p-5 hover:shadow-md transition-shadow`}
          >
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className="text-3xl font-bold text-navy mb-1">{card.value}</p>
            <p className="text-xs text-text-muted">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Phase status */}
      <div className="bg-gold-pale border border-gold/30 rounded-xl p-5">
        <h2 className="font-semibold text-navy mb-3">🏗️ Build Progress</h2>
        <div className="space-y-2 text-sm">
          {[
            { phase: "Phase 0", label: "Design & Implementation Plan", done: true },
            { phase: "Phase 1", label: "Foundation (you are here)", done: true, active: true },
            { phase: "Phase 2", label: "Database & Seed", done: false },
            { phase: "Phase 3", label: "Storefront", done: false },
            { phase: "Phase 4", label: "Quotes", done: false },
            { phase: "Phase 5", label: "Admin Dashboard", done: false },
            { phase: "Phase 6", label: "Polish & Phase 1 Release", done: false },
          ].map((item) => (
            <div key={item.phase} className="flex items-center gap-3">
              <span
                className={`text-lg ${item.done ? "text-success" : "text-text-muted"}`}
                aria-hidden
              >
                {item.done ? "✅" : "⏳"}
              </span>
              <span
                className={`font-medium ${item.active ? "text-navy" : item.done ? "text-success" : "text-text-muted"}`}
              >
                {item.phase}
              </span>
              <span className={item.active ? "text-navy" : "text-text-secondary"}>
                {item.label}
              </span>
              {item.active && (
                <span className="ml-auto bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  CURRENT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Add Product", href: "/admin/products/new", emoji: "➕" },
          { label: "Categories", href: "/admin/categories", emoji: "🗂️" },
          { label: "Hero Slides", href: "/admin/hero-slides", emoji: "🖼️" },
          { label: "Settings", href: "/admin/settings", emoji: "⚙️" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-card border border-border rounded-xl p-4 text-center hover:border-gold hover:shadow-sm transition-all text-sm font-medium text-navy"
          >
            <span className="text-2xl block mb-1" aria-hidden>
              {action.emoji}
            </span>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
