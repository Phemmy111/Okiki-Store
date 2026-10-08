"use client";
import { useState, useTransition } from "react";
import { updateQuoteStatusAction, deleteQuoteAction } from "./actions";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  quoted: "bg-orange-100 text-orange-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-gray-100 text-gray-500",
};

type QuoteItem = {
  id: number;
  productNameSnapshot: string;
  qty: number;
};

type Quote = {
  id: number;
  name: string;
  phone: string;
  businessName: string | null;
  message: string | null; receiptUrl: string | null;
  status: string;
  createdAt: Date;
  items: QuoteItem[];
};

export default function AdminQuotesClient({ quotes }: { quotes: Quote[] }) {
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleStatusChange = (id: number, status: string) => {
    startTransition(() => updateQuoteStatusAction(id, status));
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this quote request? This cannot be undone.")) return;
    startTransition(() => deleteQuoteAction(id));
  };

  if (quotes.length === 0) {
    return (
      <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
        <p className="text-4xl mb-3">💬</p>
        <p className="font-semibold text-navy mb-1">No quote requests yet</p>
        <p className="text-sm text-text-muted">When customers submit quote requests, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((quote) => (
        <div key={quote.id} className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Row */}
          <div className="flex items-start sm:items-center justify-between gap-3 px-5 py-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-navy">{quote.name}</span>
                {quote.businessName && (
                  <span className="text-xs text-text-muted">· {quote.businessName}</span>
                )}
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[quote.status] ?? "bg-gray-100 text-gray-500"}`}>
                  {quote.status}
                </span>
                <span className="text-xs bg-page border border-border px-2 py-0.5 rounded-full text-text-muted">
                  {quote.items.length} item{quote.items.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-sm text-text-secondary mt-0.5 flex gap-3 flex-wrap">
                <span>📞 {quote.phone}</span>
                <span>🕐 {new Date(quote.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Status dropdown */}
              <select
                value={quote.status}
                onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                disabled={isPending}
                className="border border-border rounded-lg px-2 py-1.5 text-xs text-navy focus:outline-none focus:ring-1 focus:ring-gold/50 bg-white disabled:opacity-60"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>

              <a
                href={`https://wa.me/${quote.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${quote.name}, regarding your quote request...`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>

              <button
                onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
                className="text-blue text-xs font-semibold hover:underline"
              >
                {expandedId === quote.id ? "▲ Hide" : "▼ Details"}
              </button>

              <button
                onClick={() => handleDelete(quote.id)}
                disabled={isPending}
                className="text-red-500 text-xs font-semibold hover:underline disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Expanded details */}
          {expandedId === quote.id && (
            <div className="border-t border-border bg-page px-5 py-4 space-y-4">
                            {quote.receiptUrl && (
                <div>
                  <p className="text-xs font-bold text-navy mb-1 uppercase tracking-wide">Payment Receipt</p>
                  <a href={quote.receiptUrl} target="_blank" rel="noopener noreferrer">
                    <img src={quote.receiptUrl} alt="Receipt" className="w-full max-w-sm rounded-xl border border-border" />
                  </a>
                </div>
              )}
              {quote.message && (
                <div>
                  <p className="text-xs font-bold text-navy mb-1 uppercase tracking-wide">Customer Message</p>
                  <p className="text-sm text-text-secondary bg-white border border-border rounded-xl p-3">{quote.message}</p>
                </div>
              )}
              {quote.items.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-navy mb-2 uppercase tracking-wide">Requested Items</p>
                  <div className="space-y-1.5">
                    {quote.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-2.5 text-sm">
                        <span className="font-medium text-navy">{item.productNameSnapshot}</span>
                        <span className="text-text-muted text-xs">Qty: {item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

