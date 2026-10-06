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
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<{ publicId: string; type: "image" | "video" }[]>([]);
  const [priceMode, setPriceMode] = useState("show");
  const formRef = useRef<HTMLFormElement>(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  const makeSignature = async (callback: Function, paramsToSign: any) => {
    const res = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paramsToSign }),
    });
    const data = await res.json();
    callback(data.signature);
  };

  // ── Thumbnail widget (single image) ──────────────────────────────────────
  const openThumbnailWidget = () => {
    if (typeof window === "undefined" || !(window as any).cloudinary) {
      alert("Upload widget not ready yet. Wait a moment and try again.");
      return;
    }
    (window as any).cloudinary.createUploadWidget(
      {
        cloudName,
        uploadSignature: makeSignature,
        apiKey,
        resourceType: "image",
        multiple: false,
        maxFiles: 1,
        sources: ["local", "url"],
        cropping: true,
        croppingAspectRatio: 1,
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          setThumbnail(result.info.public_id);
        }
      }
    ).open();
  };

  // ── Additional media widget (images + videos) ─────────────────────────────
  const openMediaWidget = () => {
    if (typeof window === "undefined" || !(window as any).cloudinary) {
      alert("Upload widget not ready yet. Wait a moment and try again.");
      return;
    }
    (window as any).cloudinary.createUploadWidget(
      {
        cloudName,
        uploadSignature: makeSignature,
        apiKey,
        resourceType: "auto",
        multiple: true,
        maxFiles: 15,
        sources: ["local", "url"],
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          const type = result.info.resource_type === "video" ? "video" : "image";
          setMediaItems((prev) => [...prev, { publicId: result.info.public_id, type }]);
        }
      }
    ).open();
  };

  const removeMedia = (publicId: string) => {
    setMediaItems((prev) => prev.filter((m) => m.publicId !== publicId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set("thumbnail", thumbnail ?? "");
    fd.set("mediaPublicIds", mediaItems.map(m => m.publicId).join(","));
    fd.set("mediaTypes", mediaItems.map(m => m.type).join(","));
    startTransition(async () => {
      await addProductAction(fd);
    });
  };

  // ── Cloudinary thumb/video URL builders ─────────────────────────────────
  const thumbUrl = (publicId: string) =>
    `https://res.cloudinary.com/${cloudName}/image/upload/w_300,h_300,c_fill,f_auto,q_auto/${publicId}`;
  const videoThumb = (publicId: string) =>
    `https://res.cloudinary.com/${cloudName}/video/upload/w_200,h_200,c_fill,so_0/${publicId}.jpg`;

  const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white";
  const labelCls = "block text-sm font-semibold text-navy mb-1";
  const sectionCls = "bg-white border border-border rounded-2xl p-6 shadow-sm space-y-5";

  return (
    <>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ─────────────────────────────────────────── */}
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

        {/* ── Thumbnail ──────────────────────────────────────────── */}
        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Product Thumbnail</h2>
          <p className="text-xs text-text-muted -mt-2">This is the main cover image shown on product cards and the shop page. Upload one clear square image.</p>

          <div className="flex items-start gap-6">
            {/* Preview box */}
            <div className="shrink-0 w-36 h-36 rounded-2xl border-2 border-dashed border-border overflow-hidden bg-page flex items-center justify-center relative">
              {thumbnail ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbUrl(thumbnail)} alt="Thumbnail" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setThumbnail(null)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow"
                  >✕</button>
                </>
              ) : (
                <span className="text-3xl opacity-20">🖼️</span>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <button
                type="button"
                onClick={openThumbnailWidget}
                className="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-mid transition-colors w-full"
              >
                {thumbnail ? "🔄 Change Thumbnail" : "📷 Upload Thumbnail"}
              </button>
              {thumbnail && (
                <p className="text-xs text-green-600 font-medium">✔ Thumbnail uploaded</p>
              )}
              <p className="text-xs text-text-muted">Recommended: square image (1:1), min 600×600px. JPG or PNG.</p>
            </div>
          </div>
        </div>

        {/* ── Additional Media ───────────────────────────────────── */}
        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Additional Media</h2>
          <p className="text-xs text-text-muted -mt-2">Upload more images and/or videos customers can browse on the product detail page. These are separate from the thumbnail.</p>

          <button
            type="button"
            onClick={openMediaWidget}
            className="bg-page border-2 border-dashed border-border hover:border-gold text-navy text-sm font-semibold rounded-xl px-6 py-4 w-full transition-colors"
          >
            📷🎥 Add Images & Videos
          </button>

          {mediaItems.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {mediaItems.map((item, i) => (
                <div key={item.publicId} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.type === "video" ? videoThumb(item.publicId) : thumbUrl(item.publicId)}
                    alt={`Media ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                      <span className="text-white text-base">▶</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(item.publicId)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Pricing ────────────────────────────────────────────── */}
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

        {/* ── Inventory ──────────────────────────────────────────── */}
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

        {/* ── Labels & Visibility ───────────────────────────────── */}
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

        {/* ── Actions ───────────────────────────────────────────── */}
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
