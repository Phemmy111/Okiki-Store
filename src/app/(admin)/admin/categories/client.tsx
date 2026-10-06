"use client";
import { useState, useTransition } from "react";
import { createCategory, deleteCategory, updateCategory } from "@/lib/actions/admin-categories";

type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  imagePublicId: string | null;
  sortOrder: number;
  isSample: boolean;
};

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  async function handleCreate(formData: FormData) {
    startTransition(async () => {
      setError(null);
      const res = await createCategory(formData);
      if (res?.error) setError(res.error);
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    startTransition(async () => {
      setError(null);
      const res = await deleteCategory(id);
      if (res?.error) setError(res.error);
    });
  }
  
  return (
    <div className="space-y-6">
       {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-navy mb-4">Add New Category</h2>
        <form action={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="name"
            required
            placeholder="Category Name"
            className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <input
            type="text"
            name="icon"
            placeholder="Emoji/Icon (optional)"
            className="w-full sm:w-48 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
           <input
            type="number"
            name="sortOrder"
            defaultValue={0}
            placeholder="Sort Order"
            className="w-full sm:w-32 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-navy text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-navy/80 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isPending ? "Adding…" : "Add Category"}
          </button>
        </form>
      </div>

       <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-navy">Current Categories ({initialCategories.length})</h2>
        </div>
        <ul className="divide-y divide-border">
          {initialCategories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="text-2xl w-10 text-center">{cat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy text-sm">{cat.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">/{cat.slug} (Sort: {cat.sortOrder})</p>
                  </div>
                  <div className="shrink-0">
                     <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={isPending}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                  </div>
              </li>
          ))}
          {initialCategories.length === 0 && (
             <li className="px-6 py-8 text-center text-sm text-text-muted">
                No categories found.
             </li>
          )}
        </ul>
      </div>
    </div>
  )
}
