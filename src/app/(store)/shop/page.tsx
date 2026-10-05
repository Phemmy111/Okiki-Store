import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getAllProducts } from "@/lib/data/storefront";
import ProductCard from "@/components/store/ProductCard";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete catalog of electronics and salon equipment.",
};

export default async function ShopPage() {
  const [cats, products] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">All Products</h1>
          <p className="text-text-secondary mt-2">Browse our complete catalog</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-border rounded-xl p-5 sticky top-24">
            <h2 className="font-semibold text-navy mb-4">Categories</h2>
            <ul className="space-y-2">
              {cats.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categories/${cat.slug}`} className="text-sm text-text-secondary hover:text-blue transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-page rounded-xl border border-dashed border-border">
              <p className="text-text-muted">No products found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
