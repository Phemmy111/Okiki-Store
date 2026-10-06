"use server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireAdminDb } from "@/lib/data/auth";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

export async function saveSettingsAction(formData: FormData) {
  await requireAdminDb();

  const keys = [
    "site.name",
    "site.whatsapp_number",
    "site.email",
    "site.address",
    "site.phone1",
    "site.phone2",
    "site.url",
    "site.instagram",
    "site.facebook",
    "site.twitter",
  ];

  for (const key of keys) {
    const value = (formData.get(key) as string)?.trim() ?? "";
    if (value === "") continue;
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() },
      });
  }

  revalidatePath("/admin/settings");
}
