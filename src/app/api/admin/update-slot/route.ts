import { NextResponse } from "next/server";
import { db } from "@/db";
import { mediaSlots } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminDb } from "@/lib/data/auth";

export async function POST(request: Request) {
  try {
    await requireAdminDb();
    const { slotId, transition, duration } = await request.json();

    if (!slotId) {
      return NextResponse.json({ error: "Missing slotId" }, { status: 400 });
    }

    await db
      .update(mediaSlots)
      .set({
        defaultTransition: transition ?? "fade",
        defaultDurationMs: duration ?? 5000,
      })
      .where(eq(mediaSlots.id, slotId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("update-slot error:", error);
    return NextResponse.json({ error: "Unauthorized or server error" }, { status: 500 });
  }
}
