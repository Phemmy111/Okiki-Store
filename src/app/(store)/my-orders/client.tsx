"use client";
import { useState, useEffect, useTransition } from "react";
import { fetchMyOrdersAction, trackOrderAction } from "./actions";
import { Search, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

type OrderItem = { id: number; productNameSnapshot: string; qty: number; priceKobo: number | null };
type Order = {
  id: number;
  reference: string;
  customerName: string;
  totalKobo: number | null;
  status: string;
  createdAt: Date;
  items: OrderItem[];
};

export default function MyOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const loadOrders = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("okiki_orders") || "[]");
      if (stored.length > 0) {
        startTransition(async () => {
          const fetched = await fetchMyOrdersAction(stored);
          setOrders(fetched as any);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const ref = (fd.get("reference") as string).trim();
    const email = (fd.get("email") as string).trim();

    startTransition(async () => {
      const res = await trackOrderAction(ref, email);
      if (res.error) {
        setError(res.error);
      } else {
        // Save to local storage and reload
        try {
          const stored = JSON.parse(localStorage.getItem("okiki_orders") || "[]");
          if (!stored.includes(ref)) {
            stored.push(ref);
            localStorage.setItem("okiki_orders", JSON.stringify(stored));
          }
        } catch {}
        loadOrders();
      }
    });
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "processing": return <span className="flex items-center gap-1 text-blue-600 font-medium"><Clock className="w-4 h-4" /> Processing</span>;
      case "confirmed": return <span className="flex items-center gap-1 text-orange-500 font-medium"><CheckCircle className="w-4 h-4" /> Confirmed</span>;
      case "delivered": return <span className="flex items-center gap-1 text-green-600 font-medium"><Package className="w-4 h-4" /> Delivered</span>;
      case "rejected": return <span className="flex items-center gap-1 text-red-600 font-medium"><XCircle className="w-4 h-4" /> Rejected</span>;
      default: return <span className="text-gray-500 font-medium capitalize">{status}</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-text-muted">Loading your orders...</div>;
  }

  return (
    <div className="space-y-8">
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.reference} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-page px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide font-bold mb-1">Order Reference</p>
                  <p className="font-display font-bold text-navy">{order.reference}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide font-bold mb-1">Date</p>
                  <p className="text-sm font-medium text-navy">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide font-bold mb-1">Total</p>
                  <p className="text-sm font-medium text-navy">
                    {order.totalKobo ? `₦${(order.totalKobo / 100).toLocaleString()}` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide font-bold mb-1">Status</p>
                  {getStatusDisplay(order.status)}
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs font-bold text-navy mb-3 uppercase tracking-wide">Items</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-navy">{item.productNameSnapshot} <span className="text-text-muted">x{item.qty}</span></span>
                      <span className="font-medium text-text-secondary">
                        {item.priceKobo ? `₦${(item.priceKobo / 100).toLocaleString()}` : "Ask for price"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white border border-border rounded-2xl">
          <Package className="w-12 h-12 text-border mx-auto mb-3" />
          <p className="text-navy font-semibold">No recent orders found on this device.</p>
          <p className="text-sm text-text-secondary mt-1">If you have an order reference, track it below.</p>
        </div>
      )}

      {/* Track Order Form */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm max-w-md mx-auto mt-12">
        <h2 className="font-bold text-navy text-lg flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-gold" /> Track an Order
        </h2>
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Order Reference</label>
            <input name="reference" required placeholder="e.g. OKI-123456" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Email Address</label>
            <input name="email" type="email" required placeholder="Email used for the order" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button type="submit" disabled={isPending} className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-navy-mid transition-colors disabled:opacity-60">
            {isPending ? "Tracking..." : "Track Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
