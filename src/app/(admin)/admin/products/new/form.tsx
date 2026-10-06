"use client";
import { useState, useTransition, useRef } from "react";
import { addProductAction } from "./actions";
import { useRouter } from "next/navigation";
import Script from "next/script";

type Category = { id: number; name: string };
type Brand = { id: number; name: string };

export default function AddProductForm({
  categories,
  brands,
  cloudName,
  apiKey,
}: {
  categories: Category[];
  brands: Brand[];
  cloudName: string;
  apiKey: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mediaPublicIds, setMediaPublicIds] = useState<string[]>([]);
  const [priceMode, setPriceMode] = useState("show");
  const formRef = useRef<HTMLFormElement>(null);

  const openWidget = () => {
    if (typeof window === "undefined" || !(window as any).cloudinary) {
      alert("Upload widget not ready yet. Wait a moment and try again.");
      return;
    }
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName,
        uploadSignature: async (callback: Function, paramsToSign: any) => {
          const res = await fetch("/api/cloudinary/sign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paramsToSign }),
          });
          const data = await res.json();
          callback(data.signature);
        },
        apiKey,
        resourceType: "image",
        multiple: true,
        maxFiles: 10,
        sources: ["local", "url"],
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          setMediaPublicIds((prev) => [...prev, result.info.public_id]);
        }
      }
    );
    widget.open();
  };

  const removeImage = (publicId: string) => {
    setMediaPublicIds((prev) => prev.filter((id) => id !== publicId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set("mediaPublicIds", mediaPublicIds.join(","));
    startTransition(async () => {
      await addProductAction(fd);
    });
  };

  const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white";
  const labelCls = "block text-sm font-semibold text-navy mb-1";
  const sectionCls = "bg-white border border-border rounded-2xl p-6 shadow-sm space-y-5";

  return (
    <>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Basic Information</h2>

          <div>
            <label className={labelCls}>Product Name *</label>
            <input name="name" required placeholder="e.g. Barber Chair Pro 3000" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea name="description" rows={4} placeholder="Describe the product..." className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select name="categoryId" className={inputCls}>
                <option value="">— No Category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Brand</label>
              <select name="brandId" className={inputCls}>
                <option value="">— No Brand —</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Pricing</h2>

          <div>
            <label className={labelCls}>Price Mode</label>
            <select name="priceMode" className={inputCls} value={priceMode} onChange={(e) => setPriceMode(e.target.value)}>
              <option value="show">Show Price</option>
              <option value="call">Call for Price</option>
              <option value="wholesale">Wholesale Only</option>
            </select>
          </div>

          {priceMode === "show" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price (₦)</label>
                <input name="price" type="number" min="0" step="0.01" placeholder="e.g. 85000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Compare-at Price (₦) <span className="font-normal text-text-muted">optional</span></label>
                <input name="compareAt" type="number" min="0" step="0.01" placeholder="e.g. 95000" className={inputCls} />
              </div>
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Inventory</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Stock Status</label>
              <select name="stockStatus" className={inputCls}>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="preorder">Pre-order</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Stock Quantity</label>
              <input name="stockQty" type="number" min="0" defaultValue={0} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Warranty Note <span className="font-normal text-text-muted">optional</span></label>
              <input name="warrantyNote" placeholder="e.g. 1 Year Manufacturer Warranty" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Delivery Note <span className="font-normal text-text-muted">optional</span></label>
              <input name="deliveryNote" placeholder="e.g. Delivered within Ibadan in 24hrs" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Product Images</h2>

          <button type="button" onClick={openWidget} className="bg-page border-2 border-dashed border-border hover:border-gold text-navy text-sm font-semibold rounded-xl px-6 py-4 w-full transition-colors">
            📷 Upload Images (click to open uploader)
          </button>

          {mediaPublicIds.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {mediaPublicIds.map((id, i) => (
                <div key={id} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_200,c_fill/${id}`}
                    alt={`Image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-gold text-navy text-[9px] font-bold px-1 py-0.5 rounded">MAIN</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(id)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flags */}
        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Labels & Visibility</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "isFeatured", label: "⭐ Featured" },
              { name: "isNewArrival", label: "🆕 New Arrival" },
              { name: "isHotDeal", label: "🔥 Hot Deal" },
              { name: "isPublished", label: "✅ Published" },
            ].map((flag) => (
              <label key={flag.name} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name={flag.name}
                  defaultChecked={flag.name === "isPublished"}
                  className="w-4 h-4 rounded accent-gold"
                />
                <span className="text-sm text-navy font-medium">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-navy text-white font-bold py-3 rounded-xl hover:bg-navy-mid transition-colors disabled:opacity-60"
          >
            {isPending ? "Saving..." : "💾 Save Product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="flex-1 border border-border text-navy font-semibold py-3 rounded-xl hover:bg-page transition-colors"
          >
            Cancel
          </button>
        </div>

      </form>
    </>
  );
}
