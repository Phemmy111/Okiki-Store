"use client";
import { useState, useTransition } from "react";
import {
  createBundleAction,
  deleteBundleAction,
  addBundleItemAction,
  removeBundleItemAction,
} from "@/lib/actions/admin-bundles";

type Product = { id: number; name: string; imagePublicId: string | null };
type BundleItem = { id: number; qty: number; product: Product | null };
type Bundle = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  priceKobo: number | null;
  priceMode: string;
  isPublished: boolean;
  items: BundleItem[];
};

export default function AdminBundlesClient({
  bundles,
  products,
  cloudName,
}: {
  bundles: Bundle[];
  products: Product[];
  cloudName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [priceMode, setPriceMode] = useState("show");

  const handleDelete = (id: number) => {
    if (!confirm("Delete this bundle? This cannot be undone.")) return;
    startTransition(() => deleteBundleAction(id));
  };

  const handleRemoveItem = (itemId: number) => {
    startTransition(() => removeBundleItemAction(itemId));
  };

  const inputCls =
    "w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white";
  const labelCls = "block text-sm font-semibold text-navy mb-1";

  return (
    <div className="space-y-6">
      {/* ── Create Bundle Form ──────────────────────────────────────────── */}
      {showCreate ? (
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-navy text-lg">Create New Bundle</h2>
            <button
              onClick={() => setShowCreate(false)}
              className="text-text-muted hover:text-navy text-sm"
            >
              Cancel
            </button>
          </div>

          <form
            action={async (fd) => {
              await createBundleAction(fd);
              setShowCreate(false);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Bundle Name *</label>
                <select name="name" required className={inputCls}>
                  <option value="">— Select a bundle tier —</option>
                  <option value="Starter">🟢 Starter Bundle</option>
                  <option value="Standard">🔵 Standard Bundle</option>
                  <option value="Premium">🟡 Premium Bundle</option>
                  <option value="Custom">✏️ Custom Bundle</option>
                </select>
                <p className="text-[11px] text-text-muted mt-1">
                  Starter → /bundles/starter &nbsp;·&nbsp; Standard → /bundles/standard &nbsp;·&nbsp; Premium → /bundles/premium
                </p>
              </div>
              <div>
                <label className={labelCls}>Price Mode</label>
                <select
                  name="priceMode"
                  className={inputCls}
                  value={priceMode}
                  onChange={(e) => setPriceMode(e.target.value)}
                >
                  <option value="show">Show Price</option>
                  <option value="call">Call for Price</option>
                </select>
              </div>
            </div>

            {priceMode === "show" && (
              <div>
                <label className={labelCls}>Bundle Price (₦)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 350000"
                  className={inputCls}
                />
              </div>
            )}

            <div>
              <label className={labelCls}>Description</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe what this bundle includes and who it's for..."
                className={inputCls}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked
                className="w-4 h-4 accent-gold"
              />
              <span className="text-sm font-medium text-navy">Published</span>
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="bg-navy text-white font-bold px-6 py-2.5 rounded-xl hover:bg-navy-mid transition-colors disabled:opacity-60"
            >
              {isPending ? "Creating..." : "✅ Create Bundle"}
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowCreate(true)}
          className="bg-navy text-white font-bold px-6 py-3 rounded-xl hover:bg-navy-mid transition-colors text-sm w-full sm:w-auto"
        >
          + Create Bundle
        </button>
      )}

      {/* ── Bundle List ─────────────────────────────────────────────────── */}
      {bundles.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center text-text-muted shadow-sm">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-semibold text-navy mb-1">No bundles yet</p>
          <p className="text-sm">Create your first bundle above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Bundle header row */}
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-navy text-base">{bundle.name}</span>
                    {!bundle.isPublished && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                        DRAFT
                      </span>
                    )}
                    <span className="text-xs text-text-muted bg-page px-2 py-0.5 rounded-full border border-border">
                      {bundle.items.length} item{bundle.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary mt-0.5">
                    {bundle.priceKobo
                      ? `₦${(bundle.priceKobo / 100).toLocaleString()}`
                      : "Price on request"}{" "}
                    · /{bundle.slug}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === bundle.id ? null : bundle.id)
                    }
                    className="text-xs font-semibold text-blue hover:underline"
                  >
                    {expandedId === bundle.id ? "▲ Close" : "▼ Manage Items"}
                  </button>
                  <button
                    onClick={() => handleDelete(bundle.id)}
                    disabled={isPending}
                    className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded items panel */}
              {expandedId === bundle.id && (
                <div className="border-t border-border bg-page px-5 py-5 space-y-5">
                  {/* Current items */}
                  <div>
                    <h3 className="text-sm font-bold text-navy mb-3">
                      Items in this bundle
                    </h3>
                    {bundle.items.length === 0 ? (
                      <p className="text-xs text-text-muted italic">
                        No items yet. Add products below.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {bundle.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-2.5"
                          >
                            {item.product?.imagePublicId && (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={`https://res.cloudinary.com/${cloudName}/image/upload/w_60,h_60,c_fill/${item.product.imagePublicId}`}
                                alt=""
                                className="w-8 h-8 rounded object-cover border border-border"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-navy truncate">
                                {item.product?.name ?? "Unknown Product"}
                              </p>
                              <p className="text-xs text-text-muted">Qty: {item.qty}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isPending}
                              className="text-red-500 hover:text-red-700 text-xs font-bold disabled:opacity-50"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add product to bundle */}
                  <div>
                    <h3 className="text-sm font-bold text-navy mb-3">Add a Product</h3>
                    <form
                      action={addBundleItemAction}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <input type="hidden" name="bundleId" value={bundle.id} />
                      <select
                        name="productId"
                        required
                        className="flex-1 border border-border rounded-xl px-4 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
                      >
                        <option value="">— Select a product —</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-navy font-medium whitespace-nowrap">
                          Qty:
                        </label>
                        <input
                          name="qty"
                          type="number"
                          min="1"
                          defaultValue={1}
                          className="w-16 border border-border rounded-xl px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="bg-navy text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-navy-mid transition-colors disabled:opacity-60 whitespace-nowrap"
                      >
                        + Add
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
