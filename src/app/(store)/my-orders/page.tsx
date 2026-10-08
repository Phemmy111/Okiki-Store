import MyOrdersClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | OKIKI Store",
};

export default function MyOrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh]">
      <h1 className="font-display text-3xl font-bold text-navy mb-2">My Orders</h1>
      <p className="text-text-secondary text-sm mb-8">Track your recent orders and view their status.</p>
      
      <MyOrdersClient />
    </div>
  );
}
