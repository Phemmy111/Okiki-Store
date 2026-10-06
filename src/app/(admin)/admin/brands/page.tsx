import { Metadata } from "next";

export const metadata: Metadata = { title: "Brands | Admin" };

export default function AdminBrandsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Brands</h1>
          <p className="text-sm text-text-secondary">Manage brands and manufacturer logos.</p>
        </div>
        <button className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-mid">
          + Add Brand
        </button>
      </div>
      
      <div className="bg-white border border-border rounded-2xl shadow-sm p-10 text-center text-text-muted">
        Brands management UI coming soon...
      </div>
    </div>
  );
}
