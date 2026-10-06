import { requireAdminDb } from "@/lib/data/auth";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | OKIKI Store",
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  { href: "/admin", label: "📊 Overview" },
  { href: "/admin/products", label: "📦 Products" },
  { href: "/admin/categories", label: "🗂️  Categories" },
  { href: "/admin/brands", label: "🏷️  Brands" },
  { href: "/admin/bundles", label: "🎁  Bundles" },
  { href: "/admin/media-slots", label: "🖼️  Media Slots" },
  { href: "/admin/quotes", label: "💬  Quote Requests" },
  { href: "/admin/admins", label: "👥  Admins" },
  { href: "/admin/settings", label: "⚙️  Settings" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminDb();

  return (
    <div className="min-h-screen bg-page flex">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex md:flex-col w-56 lg:w-64 bg-navy text-white shrink-0 sticky top-0 h-screen">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="block">
            <span className="font-display text-2xl font-bold text-gold">
              OKIKI
            </span>
            <span className="block text-[10px] text-white/50 mt-0.5 uppercase tracking-widest">
              Admin Dashboard
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Admin navigation">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer links */}
        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            ← Back to store
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile admin bar */}
        <div className="md:hidden flex items-center justify-between bg-navy text-white px-4 py-3 border-b border-white/10">
          <span className="font-display text-xl font-bold text-gold">OKIKI Admin</span>
          <Link href="/" className="text-xs text-white/60 hover:text-white">
            ← Store
          </Link>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8" id="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
