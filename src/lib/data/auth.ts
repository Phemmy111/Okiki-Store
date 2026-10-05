import "server-only";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Ensures the current caller is logged in and their email is in the `admins` table.
 * Throws an error if not authorized.
 * @returns { userId, email } of the authorized admin
 */
export async function requireAdminDb() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: Not logged in via Clerk");
  }

  // Assuming email is available in session claims, or we fetch it from Clerk API.
  // We can just use the token claims if configured, but by default we might not have it.
  // Actually, we can use `currentUser()` from Clerk, but it adds a small delay.
  // Let's use `currentUser` for safety to get the primary email.
  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();

  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    throw new Error("Unauthorized: No email address associated with account");
  }

  // Check against our database admins table
  const adminRecords = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  if (adminRecords.length === 0) {
    throw new Error("Unauthorized: Your email is not registered as an admin in the database");
  }

  return { userId, email, adminId: adminRecords[0].id };
}
