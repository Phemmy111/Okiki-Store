import { requireAdminDb } from "@/lib/data/auth";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { asc } from "drizzle-orm";
import AdminsClient from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admins | Admin" };

export default async function AdminsPage() {
  const { email: currentEmail } = await requireAdminDb();

  // Only super_admins can access this page
  const currentAdmin = await db
    .select()
    .from(admins)
    .where(
      (await import("drizzle-orm")).ilike(admins.email, currentEmail!)
    )
    .limit(1);

  if (!currentAdmin[0] || currentAdmin[0].role !== "super_admin") {
    const { redirect } = await import("next/navigation");
    redirect("/admin");
  }

  const allAdmins = await db.select().from(admins).orderBy(asc(admins.createdAt));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">Admin Users</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Manage who can access this dashboard. Only super admins can add or remove admins.
        </p>
      </div>
      <AdminsClient admins={allAdmins} currentEmail={currentEmail!} />
    </div>
  );
}
