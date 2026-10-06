import { Metadata } from "next";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { desc } from "drizzle-orm";
import AdminBrandsClient from "./client";

export const metadata: Metadata = { title: "Brands | Admin" };

export default async function AdminBrandsPage() {
  await requireAdminDb();
  const allBrands = await db.select().from(brands).orderBy(desc(brands.id));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Brands</h1>
          <p className="text-sm text-text-secondary">Manage brands and manufacturer logos.</p>
        </div>
        <button className="shrink-0 bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-mid transition-colors w-full sm:w-auto">
          + Add Brand
        </button>
      </div>
      
      <AdminBrandsClient
        brands={allBrands}
        cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ""}
      />
    </div>
  );
}
