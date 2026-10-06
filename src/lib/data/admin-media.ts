import { db } from "../db";
import { mediaSlots, slides } from "../db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdminDb } from "./auth";

export async function getAllMediaSlots() {
  await requireAdminDb();
  return db.select().from(mediaSlots).orderBy(asc(mediaSlots.slug));
}

export async function getSlidesForSlot(slotId: number) {
  await requireAdminDb();
  return db
    .select()
    .from(slides)
    .where(eq(slides.slotId, slotId))
    .orderBy(asc(slides.sortOrder));
}
