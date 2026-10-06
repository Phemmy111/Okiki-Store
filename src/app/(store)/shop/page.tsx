import type { Metadata } from "next";
import Link from "next/link";
import { getShopProducts, getCategories } from "@/lib/data/storefront";
import ProductCard from "@/components/store/ProductCard";
import MediaSlider from "@/components/store/MediaSlider";

export const metadata: Metadata = { title: "Shop All Products" };

const PER_PAGE = 24;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    category?: string;
    min?: string;
    max?: string;
    q?: string;
  };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const categorySlug = searchParams.category;
  const minPrice = searchParams.min ? parseInt(searchParams.min) : undefined;
  const maxPrice = searchParams.max ? parseInt(searchParams.max) : undefined;
  const q = searchParams.q;

  const [{ items, total }, categories] = await Promise.all([
    getShopProducts({ page, perPage: PER_PAGE, categorySlug, minPrice, maxPrice, q }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = {
      page: String(page),
      category: categorySlug,
      min: searchParams.min,
      max: searchParams.max,
      q,
      ...overrides,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    return `/shop?${params.toString()}`;
  }

  return (
    <>
      {/* Banner */}
      <div className="relative">
        <MediaSlider slot="shop-banner" className="h-48 md:h-64">
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
              {q
                ? `Search: "${q}"`
                : categorySlug
                ? (categories.find((c) => c.slug === categorySlug)?.name ?? "Products")
                : "All Products"}
            </h1>
            <p className="text-white/80 text-sm drop-shadow">
              {total} product{total !== 1 ? "s" : ""} available
            </p>
          </div>
        </MediaSlider>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-56 shrink-0 space-y-5">
            <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wide">Category</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href={buildUrl({ category: undefined, page: "1" })}
                    className={`block text-sm px-2 py-1.5 rounded-lg transition-colors ${
                      !categorySlug ? "bg-navy text-white font-semibold" : "text-text-secondary hover:text-navy hover:bg-page"
                    }`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={buildUrl({ category: cat.slug, page: "1" })}
                      className={`block text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        categorySlug === cat.slug ? "bg-navy text-white font-semibold" : "text-text-secondary hover:text-navy hover:bg-page"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <form method="GET" action="/shop" className="bg-white rounded-xl border border-border p-5 shadow-sm">
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
              {q && <input type="hidden" name="q" value={q} />}
              <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wide">Price (₦)</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  name="min"
                  placeholder="Min price"
                  defaultValue={minPrice}
                  className="w-full border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max price"
                  defaultValue={maxPrice}
                  className="w-full border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
              <button
                type="submit"
                className="mt-3 w-full bg-navy text-white text-sm font-semibold py-2 rounded-lg hover:bg-navy-mid transition-colors"
              >
                Apply Filter
              </button>
              {(minPrice || maxPrice) && (
                <Link
                  href={buildUrl({ min: undefined, max: undefined, page: "1" })}
                  className="block text-center text-xs text-text-muted mt-2 hover:text-navy"
                >
                  Clear price filter
                </Link>
              )}
            </form>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {(categorySlug || minPrice || maxPrice || q) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {q && (
                  <Link href={buildUrl({ q: undefined, page: "1" })} className="flex items-center gap-1 bg-navy/10 text-navy text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-navy/20">
                    "{q}" ✕
                  </Link>
                )}
                {categorySlug && (
                  <Link href={buildUrl({ category: undefined, page: "1" })} className="flex items-center gap-1 bg-navy/10 text-navy text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-navy/20">
                    {categories.find((c) => c.slug === categorySlug)?.name} ✕
                  </Link>
                )}
                {(minPrice || maxPrice) && (
                  <Link href={buildUrl({ min: undefined, max: undefined, page: "1" })} className="flex items-center gap-1 bg-navy/10 text-navy text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-navy/20">
                    ₦{minPrice?.toLocaleString() ?? "0"} – ₦{maxPrice?.toLocaleString() ?? "∞"} ✕
                  </Link>
                )}
              </div>
            )}

            {items.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-border">
                <p className="text-5xl mb-4">🔍</p>
                <h2 className="font-display text-2xl font-bold text-navy mb-2">No products found</h2>
                <p className="text-text-secondary mb-6">Try different filters or browse all products.</p>
                <Link href="/shop" className="bg-gold text-navy font-bold px-6 py-3 rounded-full hover:bg-gold-light transition-colors">
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-text-secondary mb-4">
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total} products
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {page > 1 && (
                      <Link href={buildUrl({ page: String(page - 1) })} className="px-4 py-2 rounded-lg bg-white border border-border text-sm text-navy hover:bg-page transition-colors">
                        ← Prev
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => Math.abs(p - page) <= 2)
                      .map((p) => (
                        <Link
                          key={p}
                          href={buildUrl({ page: String(p) })}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                            p === page ? "bg-navy text-white border-navy" : "bg-white border-border text-navy hover:bg-page"
                          }`}
                        >
                          {p}
                        </Link>
                      ))}
                    {page < totalPages && (
                      <Link href={buildUrl({ page: String(page + 1) })} className="px-4 py-2 rounded-lg bg-white border border-border text-sm text-navy hover:bg-page transition-colors">
                        Next →
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
