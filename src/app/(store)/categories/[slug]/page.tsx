import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/data/storefront";
import ProductCard from "@/components/store/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);
  if (!category) return { title: "Category Not Found" };
  
  return {
    title: category.name,
    description: `Shop the latest ${category.name} products at OKIKI Electronics Store.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const [category, cats] = await Promise.all([
    getCategoryBySlug(resolvedParams.slug),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.id);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy flex items-center gap-3">
            {category.icon && <span aria-hidden>{category.icon}</span>}
            {category.name}
          </h1>
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
                  <Link 
                    href={`/categories/${cat.slug}`} 
                    className={`text-sm flex items-center justify-between transition-colors ${
                      cat.slug === resolvedParams.slug ? "text-gold font-bold" : "text-text-secondary hover:text-blue"
                    }`}
                  >
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
            <div className="text-center py-20 bg-page rounded-xl border border-dashed border-border flex flex-col items-center">
              <p className="text-text-muted mb-4">No products found in this category.</p>
              <Link href="/shop" className="text-blue hover:underline font-medium text-sm">
                View all products →
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
