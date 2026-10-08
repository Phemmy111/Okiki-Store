"use client";`nimport React, { useState, useTransition } from "react";
import { updateOrderStatusAction, deleteOrderAction } from "./actions";

type OrderItem = {
  id: number;
  productNameSnapshot: string;
  qty: number;
};

type Order = {
  id: number;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes: string | null;
  receiptUrl: string | null;
  status: string;
  createdAt: Date;
  items: OrderItem[];
};

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleStatusChange = (id: number, status: string) => {
    startTransition(() => {
      updateOrderStatusAction(id, status);
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this order?")) {
      startTransition(() => {
        deleteOrderAction(id);
      });
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-border rounded-2xl p-10 text-center">
        <p className="text-navy font-semibold">No orders found.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-orange-100 text-orange-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-page border-b border-border text-xs uppercase tracking-wider text-text-secondary">
              <th className="py-3 px-5 font-bold">Ref</th>
              <th className="py-3 px-5 font-bold">Customer</th>
              <th className="py-3 px-5 font-bold">Contact</th>
              <th className="py-3 px-5 font-bold">Items</th>
              <th className="py-3 px-5 font-bold">Status</th>
              <th className="py-3 px-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-page/50 transition-colors cursor-pointer group" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                  <td className="py-4 px-5 text-sm font-bold text-navy">{order.reference}</td>
                  <td className="py-4 px-5">
                    <p className="text-sm font-semibold text-navy">{order.customerName}</p>
                    {order.customerEmail && <p className="text-xs text-text-muted">{order.customerEmail}</p>}
                  </td>
                  <td className="py-4 px-5 text-sm text-text-secondary">{order.customerPhone}</td>
                  <td className="py-4 px-5 text-sm font-medium text-navy">{order.items.length}</td>
                  <td className="py-4 px-5">
                    <span className={\inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide \\}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right space-x-3">
                    <select
                      value={order.status}
                      onChange={(e) => { e.stopPropagation(); handleStatusChange(order.id, e.target.value); }}
                      disabled={isPending}
                      className="text-xs font-semibold bg-page border border-border rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
                    >
                      <option value="new">New</option>
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }} disabled={isPending} className="text-red-500 text-xs font-semibold hover:underline disabled:opacity-50">Delete</button>
                  </td>
                </tr>

                {expandedId === order.id && (
                  <tr>
                    <td colSpan={6} className="p-0 border-b border-border">
                      <div className="bg-page px-5 py-4 space-y-4">
                        {order.receiptUrl && (
                          <div>
                            <p className="text-xs font-bold text-navy mb-1 uppercase tracking-wide">Payment Receipt</p>
                            <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer">
                              <img src={order.receiptUrl} alt="Receipt" className="w-full max-w-sm rounded-xl border border-border" />
                            </a>
                          </div>
                        )}
                        {order.notes && (
                          <div>
                            <p className="text-xs font-bold text-navy mb-1 uppercase tracking-wide">Notes</p>
                            <p className="text-sm text-text-secondary bg-white border border-border rounded-xl p-3 whitespace-pre-wrap">{order.notes}</p>
                          </div>
                        )}
                        {order.items.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-navy mb-2 uppercase tracking-wide">Requested Items</p>
                            <div className="space-y-1.5">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-2.5 text-sm">
                                  <span className="font-medium text-navy">{item.productNameSnapshot}</span>
                                  <span className="text-text-muted text-xs">Qty: {item.qty}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

