import { getAllMediaSlots, getSlidesForSlot } from "@/lib/data/admin-media";
import MediaManagerClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Media Slots | Admin" };

export default async function AdminMediaSlotsPage({
  searchParams,
}: {
  searchParams: Promise<{ slotId?: string }>;
}) {
  const { slotId } = await searchParams;
  const slots = await getAllMediaSlots();

  const activeSlotId = slotId ? parseInt(slotId) : null;

  const slides =
    activeSlotId && !isNaN(activeSlotId)
      ? await getSlidesForSlot(activeSlotId)
      : [];

  const activeSlot =
    slots.find((s) => s.id === activeSlotId) ?? null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy mb-2">Media Slots Manager</h1>
        <p className="text-sm text-text-secondary">
          Manage animated sliders for the homepage and individual category pages.
        </p>
      </div>

      <MediaManagerClient
        slots={slots}
        activeSlot={activeSlot}
        slides={slides}
        cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ""}
        apiKey={process.env.CLOUDINARY_API_KEY ?? ""}
      />
    </div>
  );
}
