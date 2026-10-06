import { Metadata } from "next";

export const metadata: Metadata = { title: "Products | Admin" };

export default function AdminProductsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Products</h1>
          <p className="text-sm text-text-secondary">Manage store inventory, prices, and stock status.</p>
        </div>
        <button className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-mid">
          + Add Product
        </button>
      </div>
      
      <div className="bg-white border border-border rounded-2xl shadow-sm p-10 text-center text-text-muted">
        Products management UI coming soon...
      </div>
    </div>
  );
}
