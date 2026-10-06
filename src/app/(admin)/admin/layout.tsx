import { requireAdminDb } from "@/lib/data/auth";
import type { Metadata } from "next";
import AdminSidebar from "./AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard | OKIKI Store",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminDb();

  return (
    <div className="min-h-screen bg-page flex flex-col md:flex-row">
      {/* Sidebar handles both desktop sticky sidebar + mobile top bar + drawer */}
      <AdminSidebar />

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8" id="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
