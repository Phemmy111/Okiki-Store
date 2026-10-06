"use client";
import { useState, useTransition } from "react";
import { deleteBrand } from "@/lib/actions/admin-brands";
import Image from "next/image";

type Brand = {
  id: number;
  name: string;
  slug: string;
  logoPublicId: string | null;
};

export default function AdminBrandsClient({
  brands,
  cloudName,
}: {
  brands: Brand[];
  cloudName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      startTransition(async () => {
        await deleteBrand(id);
      });
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-page border-b border-border text-text-muted">
            <tr>
              <th className="px-6 py-4 font-semibold">Brand</th>
              <th className="px-6 py-4 font-semibold">Slug</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {brands.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-text-muted">
                  No brands found. Add one above.
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-page/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-page border border-border overflow-hidden relative shrink-0">
                        {brand.logoPublicId ? (
                          <Image
                            src={`https://res.cloudinary.com/${cloudName}/image/upload/w_100,h_100,c_fit/${brand.logoPublicId}`}
                            alt={brand.name}
                            fill
                            className="object-contain p-1"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs opacity-50">No Img</div>
                        )}
                      </div>
                      <div className="font-semibold text-navy max-w-xs truncate">{brand.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{brand.slug}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => alert("Edit modal coming soon")}
                      className="text-blue hover:underline text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      disabled={isPending}
                      className="text-red-500 hover:underline text-xs font-semibold disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
