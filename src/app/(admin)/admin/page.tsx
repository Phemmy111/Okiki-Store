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
          Welcome back
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Here is what's happening with your store today.
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
            className="flex flex-col items-center justify-center gap-2 bg-white border border-border rounded-xl p-4 text-sm font-medium text-navy hover:bg-page transition-colors text-center shadow-sm"
          >
            <span className="text-xl" aria-hidden>{btn.icon}</span>
            {btn.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
