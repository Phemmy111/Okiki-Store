import { Metadata } from "next";

export const metadata: Metadata = { title: "Quote Requests | Admin" };

export default function AdminQuotesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Quote Requests</h1>
          <p className="text-sm text-text-secondary">View incoming quote requests submitted by customers.</p>
        </div>
      </div>
      
      <div className="bg-white border border-border rounded-2xl shadow-sm p-10 text-center text-text-muted">
        Quotes management UI coming soon...
      </div>
    </div>
  );
}
