"use client";
import { useState, useTransition } from "react";
import { deleteProduct } from "@/lib/actions/admin-products";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  slug: string;
  priceKobo: number | null;
  stockStatus: string;
  isFeatured: boolean;
  imagePublicId: string | null;
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
};

export default function AdminProductsClient({
  products,
  cloudName,
}: {
  products: Product[];
  cloudName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        await deleteProduct(id);
      });
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-page border-b border-border text-text-muted">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Category / Brand</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-text-muted">
                  No products found. Add one above.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-page/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-page border border-border overflow-hidden relative shrink-0">
                        {product.imagePublicId ? (
                          <Image
                            src={`https://res.cloudinary.com/${cloudName}/image/upload/w_100,h_100,c_fill/${product.imagePublicId}`}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs opacity-50">No Img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-navy max-w-xs truncate">{product.name}</div>
                        <div className="text-xs text-text-muted">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-navy">{product.category?.name ?? "No Category"}</div>
                    <div className="text-xs text-text-muted">{product.brand?.name ?? "No Brand"}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-navy">
                    {product.priceKobo ? `₦${(product.priceKobo / 100).toLocaleString()}` : "Ask for price"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                      product.stockStatus === "in_stock" ? "bg-green-100 text-green-700" :
                      product.stockStatus === "out_of_stock" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {product.stockStatus.replace("_", " ").toUpperCase()}
                    </span>
                    {product.isFeatured && (
                      <span className="ml-2 inline-flex px-2 py-1 rounded text-xs font-semibold bg-gold/20 text-gold-dark">
                        ⭐ Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => alert("Edit modal coming soon")}
                      className="text-blue hover:underline text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
