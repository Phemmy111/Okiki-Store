import type { Metadata } from "next";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import SettingsClient from "./client";

export const metadata: Metadata = { title: "Store Settings | Admin" };

export default async function AdminSettingsPage() {
  await requireAdminDb();

  const rows = await db.select().from(settings);
  const settingsMap: Record<string, string> = Object.fromEntries(
    rows.map((r) => [r.key, r.value])
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Store Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your store's contact details, social links, and global configuration.
        </p>
      </div>
      <SettingsClient initialSettings={settingsMap} />
    </div>
  );
}
