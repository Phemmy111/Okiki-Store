import type { Metadata } from "next";
import Link from "next/link";
import { searchProducts } from "@/lib/data/storefront";
import ProductCard from "@/components/store/ProductCard";

export const metadata: Metadata = { title: "Search Products" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const results = q ? await searchProducts(q) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <form method="GET" action="/search" className="flex gap-3 max-w-xl">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            autoFocus
            className="flex-1 border border-border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white shadow-sm"
          />
          <button
            type="submit"
            className="bg-navy text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-navy-mid transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {q && (
          <p className="mt-4 text-text-secondary text-sm">
            {results.length > 0
              ? `Found ${results.length} result${results.length !== 1 ? "s" : ""} for `
              : "No results for "}
            <span className="font-semibold text-navy">"{q}"</span>
          </p>
        )}
      </div>

      {/* Results */}
      {!q ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="font-display text-2xl font-bold text-navy mb-2">What are you looking for?</h2>
          <p className="text-text-secondary">Search for salon chairs, generators, ring lights, and more.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-border">
          <p className="text-5xl mb-4">😔</p>
          <h2 className="font-display text-2xl font-bold text-navy mb-2">No products found</h2>
          <p className="text-text-secondary mb-6">
            We couldn&apos;t find anything matching &quot;{q}&quot;. Try a different search term.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="bg-gold text-navy font-bold px-6 py-3 rounded-full hover:bg-gold-light transition-colors">
              Browse All Products
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348022932216"}?text=Hi%2C+do+you+have+${encodeURIComponent(q)}+in+stock%3F`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-navy text-navy font-bold px-6 py-3 rounded-full hover:bg-navy hover:text-white transition-colors"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
