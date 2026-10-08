"use client";
import { useState, useTransition, useRef } from "react";
import { editProductAction } from "./actions";
import { useRouter } from "next/navigation";
import Script from "next/script";

type Category = { id: number; name: string };
type Brand = { id: number; name: string };

export default function EditProductForm({
  product,
  categories,
  brands,
  cloudName,
  apiKey,
}: {
  product: any;
  categories: Category[];
  brands: Brand[];
  cloudName: string;
  apiKey: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [thumbnail, setThumbnail] = useState<string | null>(
    product.media?.find((m: any) => m.sortOrder === 0)?.publicId || null
  );
  const [mediaItems, setMediaItems] = useState<{ publicId: string; type: "image" | "video" }[]>(
    product.media?.filter((m: any) => m.sortOrder > 0).map((m: any) => ({ publicId: m.publicId, type: m.type })) || []
  );
  const [priceMode, setPriceMode] = useState(product.priceMode || "show");
  const formRef = useRef<HTMLFormElement>(null);

  // --- helpers ---
  const makeSignature = async (callback: Function, paramsToSign: any) => {
    const res = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paramsToSign }),
    });
    const data = await res.json();
    callback(data.signature);
  };

  const openThumbnailWidget = () => {
    if (typeof window === "undefined" || !(window as any).cloudinary) return;
    (window as any).cloudinary.createUploadWidget(
      { cloudName, uploadSignature: makeSignature, apiKey, resourceType: "image", multiple: false, maxFiles: 1, sources: ["local", "url"], cropping: true, croppingAspectRatio: 1 },
      (error: any, result: any) => { if (!error && result?.event === "success") setThumbnail(result.info.public_id); }
    ).open();
  };

  const openMediaWidget = () => {
    if (typeof window === "undefined" || !(window as any).cloudinary) return;
    (window as any).cloudinary.createUploadWidget(
      { cloudName, uploadSignature: makeSignature, apiKey, resourceType: "auto", multiple: true, maxFiles: 15, sources: ["local", "url"] },
      (error: any, result: any) => { if (!error && result?.event === "success") { const type = result.info.resource_type === "video" ? "video" : "image"; setMediaItems((prev) => [...prev, { publicId: result.info.public_id, type }]); } }
    ).open();
  };

  const removeMedia = (publicId: string) => setMediaItems((prev) => prev.filter((m) => m.publicId !== publicId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set("id", product.id.toString());
    fd.set("thumbnail", thumbnail ?? "");
    fd.set("mediaPublicIds", mediaItems.map(m => m.publicId).join(","));
    fd.set("mediaTypes", mediaItems.map(m => m.type).join(","));
    startTransition(async () => { await editProductAction(fd); });
  };

  const thumbUrl = (publicId: string) => `https://res.cloudinary.com/${cloudName}/image/upload/w_300,h_300,c_fill,f_auto,q_auto/${publicId}`;
  const videoThumb = (publicId: string) => `https://res.cloudinary.com/${cloudName}/video/upload/w_200,h_200,c_fill,so_0/${publicId}.jpg`;

  const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white";
  const labelCls = "block text-sm font-semibold text-navy mb-1";
  const sectionCls = "bg-white border border-border rounded-2xl p-6 shadow-sm space-y-5";

  return (
    <>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Basic Information</h2>
          <div><label className={labelCls}>Product Name *</label><input name="name" defaultValue={product.name} required className={inputCls} /></div>
          <div><label className={labelCls}>Description</label><textarea name="description" defaultValue={product.description || ""} rows={4} className={inputCls} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select name="categoryId" defaultValue={product.categoryId || ""} className={inputCls}>
                <option value="">-- No Category --</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Brand</label>
              <select name="brandId" defaultValue={product.brandId || ""} className={inputCls}>
                <option value="">-- No Brand --</option>
                {brands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Product Thumbnail</h2>
          <div className="flex items-start gap-6">
            <div className="shrink-0 w-36 h-36 rounded-2xl border-2 border-dashed border-border overflow-hidden bg-page flex items-center justify-center relative">
              {thumbnail ? (
                <>
                  <img src={thumbUrl(thumbnail)} alt="Thumbnail" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setThumbnail(null)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow">X</button>
                </>
              ) : <span className="text-3xl opacity-20">+</span>}
            </div>
            <div className="flex-1 space-y-3">
              <button type="button" onClick={openThumbnailWidget} className="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-mid transition-colors w-full">
                {thumbnail ? "Change Thumbnail" : "Upload Thumbnail"}
              </button>
            </div>
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Additional Media</h2>
          <button type="button" onClick={openMediaWidget} className="bg-page border-2 border-dashed border-border hover:border-gold text-navy text-sm font-semibold rounded-xl px-6 py-4 w-full transition-colors">
            + Add Images & Videos
          </button>
          {mediaItems.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {mediaItems.map((item, i) => (
                <div key={item.publicId} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
                  <img src={item.type === "video" ? videoThumb(item.publicId) : thumbUrl(item.publicId)} alt="Media" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeMedia(item.publicId)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                </div>
              ))}
            </div>
          )}
        </div>

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
              <div><label className={labelCls}>Price (N)</label><input name="price" defaultValue={product.priceKobo ? product.priceKobo / 100 : ""} type="number" min="0" step="0.01" className={inputCls} /></div>
              <div><label className={labelCls}>Compare-at Price (N)</label><input name="compareAt" defaultValue={product.compareAtKobo ? product.compareAtKobo / 100 : ""} type="number" min="0" step="0.01" className={inputCls} /></div>
            </div>
          )}
        </div>

        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Stock Status</label>
              <select name="stockStatus" defaultValue={product.stockStatus} className={inputCls}>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="preorder">Pre-order</option>
              </select>
            </div>
            <div><label className={labelCls}>Stock Quantity</label><input name="stockQty" defaultValue={product.stockQty} type="number" min="0" className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Warranty Note</label><input name="warrantyNote" defaultValue={product.warrantyNote || ""} className={inputCls} /></div>
            <div><label className={labelCls}>Delivery Note</label><input name="deliveryNote" defaultValue={product.deliveryNote || ""} className={inputCls} /></div>
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">Labels & Visibility</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "isFeatured", label: "Featured", defaultChecked: product.isFeatured },
              { name: "isNewArrival", label: "New Arrival", defaultChecked: product.isNewArrival },
              { name: "isHotDeal", label: "Hot Deal", defaultChecked: product.isHotDeal },
              { name: "isPublished", label: "Published", defaultChecked: product.isPublished },
            ].map((flag) => (
              <label key={flag.name} className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" name={flag.name} defaultChecked={flag.defaultChecked} className="w-4 h-4 rounded accent-gold" />
                <span className="text-sm text-navy font-medium">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" disabled={isPending} className="flex-1 bg-navy text-white font-bold py-3 rounded-xl hover:bg-navy-mid transition-colors disabled:opacity-60">
            {isPending ? "Saving..." : "Save Product"}
          </button>
          <button type="button" onClick={() => router.push("/admin/products")} className="flex-1 border border-border text-navy font-semibold py-3 rounded-xl hover:bg-page transition-colors">
            Cancel
          </button>
        </div>

      </form>
    </>
  );
}
