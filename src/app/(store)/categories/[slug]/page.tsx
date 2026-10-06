import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getShopProducts, getCategories } from "@/lib/data/storefront";
import ProductCard from "@/components/store/ProductCard";
import MediaSlider from "@/components/store/MediaSlider";

const SLOT_MAP: Record<string, string> = {
  "salon-beauty": "cat-salon-beauty",
  "home-electronics": "cat-home-electronics",
  "power-generators": "cat-power-generators",
  "creator-gear": "cat-creator-gear",
};

const PER_PAGE = 24;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} | OKIKI Store`,
    description: `Shop the latest ${category.name} products at OKIKI Electronics Store, Ibadan.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { page?: string; min?: string; max?: string };
}) {
  const { slug } = await params;
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const minPrice = searchParams.min ? parseInt(searchParams.min) : undefined;
  const maxPrice = searchParams.max ? parseInt(searchParams.max) : undefined;

  const [category, { items, total }, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getShopProducts({ page, perPage: PER_PAGE, categorySlug: slug, minPrice, maxPrice }),
    getCategories(),
  ]);

  if (!category) notFound();

  const totalPages = Math.ceil(total / PER_PAGE);
  const slotName = SLOT_MAP[slug] ?? "shop-banner";

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = {
      page: String(page),
      min: searchParams.min,
      max: searchParams.max,
      ...overrides,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return `/categories/${slug}${qs ? `?${qs}` : ""}`;
  }

  return (
    <>
      {/* Category Banner */}
      <div className="relative">
        <MediaSlider slot={slotName} className="h-48 md:h-72">
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
            <span className="inline-block bg-gold/20 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 border border-gold/30">
              Category
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-white/80 text-sm md:text-base mt-2 max-w-lg drop-shadow">
                {category.description}
              </p>
            )}
          </div>
        </MediaSlider>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-secondary mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-navy">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-navy">Shop</Link>
          <span>›</span>
          <span className="text-navy font-medium">{category.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0 space-y-5">
            <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wide">Browse</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/shop" className="block text-sm px-2 py-1.5 rounded-lg text-text-secondary hover:text-navy hover:bg-page transition-colors">
                    All Products
                  </Link>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className={`block text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        cat.slug === slug ? "bg-navy text-white font-semibold" : "text-text-secondary hover:text-navy hover:bg-page"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <form method="GET" className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <h3 className="font-bold text-navy mb-3 text-sm uppercase tracking-wide">Price (₦)</h3>
              <div className="space-y-2">
                <input type="number" name="min" placeholder="Min" defaultValue={minPrice}
                  className="w-full border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
                <input type="number" name="max" placeholder="Max" defaultValue={maxPrice}
                  className="w-full border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
              </div>
              <button type="submit" className="mt-3 w-full bg-navy text-white text-sm font-semibold py-2 rounded-lg hover:bg-navy-mid transition-colors">
                Apply
              </button>
              {(minPrice || maxPrice) && (
                <Link href={`/categories/${slug}`} className="block text-center text-xs text-text-muted mt-2 hover:text-navy">
                  Clear filter
                </Link>
              )}
            </form>
          </aside>

          {/* Grid */}
          <main className="flex-1 min-w-0">
            {items.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-border">
                <p className="text-5xl mb-4">📦</p>
                <h2 className="font-display text-2xl font-bold text-navy mb-2">No products yet</h2>
                <p className="text-text-secondary mb-6">Check back soon — stock is on its way!</p>
                <Link href="/shop" className="bg-gold text-navy font-bold px-6 py-3 rounded-full hover:bg-gold-light transition-colors">
                  Browse All Products
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-text-secondary mb-4">
                  {total} product{total !== 1 ? "s" : ""} in {category.name}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {page > 1 && (
                      <Link href={buildUrl({ page: String(page - 1) })} className="px-4 py-2 rounded-lg bg-white border border-border text-sm text-navy hover:bg-page">← Prev</Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => Math.abs(p - page) <= 2)
                      .map((p) => (
                        <Link key={p} href={buildUrl({ page: String(p) })}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${p === page ? "bg-navy text-white border-navy" : "bg-white border-border text-navy hover:bg-page"}`}>
                          {p}
                        </Link>
                      ))}
                    {page < totalPages && (
                      <Link href={buildUrl({ page: String(page + 1) })} className="px-4 py-2 rounded-lg bg-white border border-border text-sm text-navy hover:bg-page">Next →</Link>
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
