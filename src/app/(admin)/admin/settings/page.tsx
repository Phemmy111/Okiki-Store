import { Metadata } from "next";

export const metadata: Metadata = { title: "Settings | Admin" };

export default function AdminSettingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Store Settings</h1>
          <p className="text-sm text-text-secondary">Manage contact details, social links, and global store settings.</p>
        </div>
      </div>
      
      <div className="bg-white border border-border rounded-2xl shadow-sm p-10 text-center text-text-muted">
        Settings management UI coming soon...
      </div>
    </div>
  );
}
