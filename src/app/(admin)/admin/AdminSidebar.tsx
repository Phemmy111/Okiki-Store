"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "📊 Overview" },
  { href: "/admin/products", label: "📦 Products" },
  { href: "/admin/categories", label: "🗂️ Categories" },
  { href: "/admin/brands", label: "🏷️ Brands" },
  { href: "/admin/bundles", label: "🎁 Bundles" },
  { href: "/admin/media-slots", label: "🖼️ Media Slots" },
  { href: "/admin/quotes", label: "💬 Quote Requests" },
  { href: "/admin/admins", label: "👥 Admins" },
  { href: "/admin/settings", label: "⚙️ Settings" },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navLinks = (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Admin navigation">
        {ADMIN_NAV.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          ← Back to store
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar (always visible) ─────────────────────────── */}
      <aside className="hidden md:flex md:flex-col w-56 lg:w-64 bg-navy text-white shrink-0 sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="block">
            <span className="font-display text-2xl font-bold text-gold">OKIKI</span>
            <span className="block text-[10px] text-white/50 mt-0.5 uppercase tracking-widest">
              Admin Dashboard
            </span>
          </Link>
        </div>
        {navLinks}
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between bg-navy text-white px-4 py-3 border-b border-white/10 sticky top-0 z-40">
        <Link href="/admin" className="block">
          <span className="font-display text-xl font-bold text-gold">OKIKI Admin</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-white/60 hover:text-white">
            ← Store
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer overlay ─────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-navy text-white flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <div>
                <span className="font-display text-2xl font-bold text-gold">OKIKI</span>
                <span className="block text-[10px] text-white/50 mt-0.5 uppercase tracking-widest">
                  Admin Dashboard
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {navLinks}
          </aside>
        </div>
      )}
    </>
  );
}
