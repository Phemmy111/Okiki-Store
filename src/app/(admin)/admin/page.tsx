import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { products, categories, bundles } from "@/db/schema";
import { count } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Overview | Admin",
};

export default async function AdminOverviewPage() {
  const [productCount] = await db.select({ value: count() }).from(products);
  const [categoryCount] = await db.select({ value: count() }).from(categories);
  const [bundleCount] = await db.select({ value: count() }).from(bundles);

  const QUICK_CARDS = [
    {
      label: "Products",
      value: productCount.value,
      sub: "Total products in DB",
      href: "/admin/products",
      color: "border-l-gold",
    },
    {
      label: "Categories",
      value: categoryCount.value,
      sub: "Active categories",
      href: "/admin/categories",
      color: "border-l-blue",
    },
    {
      label: "Bundles",
      value: bundleCount.value,
      sub: "Configured bundles",
      href: "/admin/bundles",
      color: "border-l-warning",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">
          Dashboard Overview
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Live database metrics and current build progress.
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
            { phase: "Phase 1", label: "Foundation & Auth", done: true },
            { phase: "Phase 2", label: "Database & Seed", done: true },
            { phase: "Phase 3", label: "Storefront & Media", done: true },
            { phase: "Phase 4", label: "Quotes / Cart (Working on this)", done: false, active: true },
            { phase: "Phase 5", label: "Admin Dashboard (Media Slots Done)", done: false },
            { phase: "Phase 6", label: "Polish & Final Release", done: false },
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
              <span className={item.active ? "text-navy font-semibold" : "text-text-secondary"}>
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
          { href: "/admin/products/new", label: "Add Product", icon: "➕" },
          { href: "/admin/categories", label: "Categories", icon: "🗂️" },
          { href: "/admin/media-slots", label: "Media Slots", icon: "🖼️" },
          { href: "/admin/settings", label: "Settings", icon: "⚙️" },
        ].map((btn) => (
          <Link
            key={btn.label}
            href={btn.href}
            className="flex flex-col items-center justify-center gap-2 bg-white border border-border rounded-xl p-4 text-sm font-medium text-navy hover:bg-page transition-colors text-center"
          >
            <span className="text-xl" aria-hidden>{btn.icon}</span>
            {btn.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
