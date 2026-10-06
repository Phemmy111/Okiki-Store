"use server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { ilike, ne } from "drizzle-orm";
import { requireAdminDb } from "@/lib/data/auth";
import { revalidatePath } from "next/cache";

async function ensureSuperAdmin() {
  const { email } = await requireAdminDb();
  const [me] = await db.select().from(admins).where(ilike(admins.email, email!)).limit(1);
  if (!me || me.role !== "super_admin") throw new Error("Only super admins can manage admins.");
  return me;
}

export async function addAdmin(formData: FormData) {
  const me = await ensureSuperAdmin();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const role = (formData.get("role") as string) === "super_admin" ? "super_admin" : "admin";

  if (!email || !email.includes("@")) return { error: "Please enter a valid email address." };

  const existing = await db.select().from(admins).where(ilike(admins.email, email)).limit(1);
  if (existing.length > 0) return { error: "That email is already an admin." };

  await db.insert(admins).values({ email, role, createdBy: me.email });
  revalidatePath("/admin/admins");
  return { success: true };
}

export async function removeAdmin(id: number) {
  const me = await ensureSuperAdmin();
  const [target] = await db.select().from(admins).where((await import("drizzle-orm")).eq(admins.id, id)).limit(1);

  if (!target) return { error: "Admin not found." };
  if (ilike(admins.email, me.email)) {
    // prevent self-delete
    if (target.email.toLowerCase() === me.email.toLowerCase()) {
      return { error: "You cannot remove yourself." };
    }
  }

  await db.delete(admins).where((await import("drizzle-orm")).eq(admins.id, id));
  revalidatePath("/admin/admins");
  return { success: true };
}

export async function updateRole(id: number, role: "super_admin" | "admin") {
  const me = await ensureSuperAdmin();
  const [target] = await db.select().from(admins).where((await import("drizzle-orm")).eq(admins.id, id)).limit(1);
  if (!target) return { error: "Admin not found." };
  if (target.email.toLowerCase() === me.email.toLowerCase()) return { error: "You cannot change your own role." };

  await db.update(admins).set({ role }).where((await import("drizzle-orm")).eq(admins.id, id));
  revalidatePath("/admin/admins");
  return { success: true };
}
