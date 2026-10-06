import "server-only";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function requireAdminDb() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    redirect("/");
  }

  const adminRecords = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  if (adminRecords.length === 0) {
    redirect("/"); // Or to a specific "unauthorized" page
  }

  return { userId, email, adminId: adminRecords[0].id };
}
