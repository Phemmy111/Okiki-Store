"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createSlide, deleteSlide, updateSlide } from "@/lib/actions/admin-media";

const TRANSITIONS = [
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "zoom", label: "Zoom" },
  { value: "parallax", label: "Ken Burns / Parallax" },
];

type Slot = {
  id: number;
  slug: string;
  label: string;
  layout: string;
  defaultTransition: string;
  defaultDurationMs: number;
  autoplay: boolean;
  showControls: boolean;
};

type Slide = {
  id: number;
  slotId: number;
  mediaType: string;
  publicId: string;
  sortOrder: number;
  headline: string | null;
  btnLabel: string | null;
  btnUrl: string | null;
  isActive: boolean;
};

export default function MediaManagerClient({
  slots,
  activeSlot,
  slides,
  cloudName,
  apiKey,
}: {
  slots: Slot[];
  activeSlot: Slot | null;
  slides: Slide[];
  cloudName: string;
  apiKey: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [transition, setTransition] = useState(activeSlot?.defaultTransition ?? "fade");
  const [duration, setDuration] = useState(activeSlot?.defaultDurationMs ?? 5000);
  const [saved, setSaved] = useState(false);

  const openWidget = () => {
    if (typeof window === "undefined" || !(window as any).cloudinary) {
      alert("Upload widget not ready yet. Wait a moment and try again.");
      return;
    }
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName,
        uploadSignature: generateSignature,
        apiKey,
        resourceType: "auto",
        maxFileSize: 104857600, // 100MB
        sources: ["local", "url"],
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          handleUploadSuccess(result.info);
        }
      }
    );
    widget.open();
  };

  const generateSignature = async (callback: Function, paramsToSign: any) => {
    try {
      const res = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paramsToSign }),
      });
      const data = await res.json();
      callback(data.signature);
    } catch (err) {
      console.error("Signature error:", err);
    }
  };

  const handleUploadSuccess = async (info: any) => {
    if (!activeSlot) return;
    setIsUploading(true);
    try {
      await createSlide({
        slotId: activeSlot.id,
        mediaType: info.resource_type === "video" ? "video" : "image",
        publicId: info.public_id,
        sortOrder: slides.length,
        isActive: true,
      });
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this media item?")) return;
    startTransition(async () => {
      await deleteSlide(id);
      router.refresh();
    });
  };

  const handleSave = async () => {
    if (!activeSlot) return;
    // Save transition + duration back to slot via an updateSlot action
    await fetch("/api/admin/update-slot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId: activeSlot.id, transition, duration }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  };

  function thumbUrl(slide: Slide) {
    if (slide.mediaType === "video") {
      return `https://res.cloudinary.com/${cloudName}/video/upload/w_300,h_200,c_fill,so_0/${slide.publicId}.jpg`;
    }
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_300,h_200,c_fill/${slide.publicId}`;
  }

  if (!activeSlot) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div key={slot.id} className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between items-start">
            <div>
              <h3 className="font-bold text-navy mb-1">{slot.label}</h3>
              <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
                <span className="bg-page px-2 py-0.5 rounded border border-border">{slot.layout}</span>
                <span>{slot.defaultDurationMs / 1000}s {slot.defaultTransition}</span>
              </div>
            </div>
            <button
              onClick={() => router.push(`?slotId=${slot.id}`)}
              className="text-sm font-semibold text-gold bg-gold/10 px-4 py-2 rounded-lg hover:bg-gold/20 transition-colors w-full text-center"
            >
              Configure Slider
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />

      <div className="max-w-4xl">
        {/* Configure Slider Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-bold text-navy text-lg">Configure Slider: {activeSlot.label}</h2>
              <p className="text-xs text-text-muted mt-0.5">Set the target slot, transition style, and timing</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Row 1: Slot + Transition + Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Target Slot */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Target Page</label>
                <select
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
                  value={activeSlot?.id ?? ""}
                  onChange={(e) => router.push(`?slotId=${e.target.value}`)}
                >
                  {slots.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Transition */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Transition Animation</label>
                <select
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
                  value={transition}
                  onChange={(e) => setTransition(e.target.value)}
                >
                  {TRANSITIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 uppercase tracking-wide">Slide Duration (ms)</label>
                <input
                  type="number"
                  min={1000}
                  max={30000}
                  step={500}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
            </div>

            {/* Media Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-navy">Media Items
                    <span className="text-text-muted font-normal ml-2 text-xs">(Order: Left to Right)</span>
                  </p>
                  <p className="text-xs text-text-muted">Supports images and MP4 videos. No file size limit.</p>
                </div>
                <button
                  onClick={openWidget}
                  disabled={isUploading || !activeSlot}
                  className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-navy/80 transition-colors disabled:opacity-50"
                >
                  <span className="text-base leading-none">+</span>
                  {isUploading ? "Uploading…" : "Add Media"}
                </button>
              </div>

              {/* Media strip */}
              {slides.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-2xl py-14 flex flex-col items-center justify-center text-center bg-page">
                  <span className="text-4xl mb-3 opacity-30">🖼️</span>
                  <p className="text-text-secondary text-sm">Click <strong>"Add Media"</strong> to upload images or MP4 videos.</p>
                  <p className="text-text-muted text-xs mt-1">The storefront will show a placeholder until media is added.</p>
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {slides.map((slide, idx) => (
                    <div key={slide.id} className="relative shrink-0 w-44 group">
                      {/* Thumbnail */}
                      <div className="w-44 h-28 rounded-xl overflow-hidden bg-black/5 border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbUrl(slide)}
                          alt={`Slide ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='176' height='112' viewBox='0 0 176 112'%3E%3Crect width='176' height='112' fill='%23f1f5f9'/%3E%3Ctext x='88' y='60' text-anchor='middle' fill='%2394a3b8' font-size='12'%3ENo preview%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                        {slide.mediaType === "video" && (
                          <div className="absolute inset-0 flex items-end justify-start p-1.5 pointer-events-none">
                            <span className="text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">▶ VIDEO</span>
                          </div>
                        )}
                      </div>

                      {/* Order badge */}
                      <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>

                      {/* Delete button — shows on hover */}
                      <button
                        onClick={() => handleDelete(slide.id)}
                        disabled={isPending}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold hidden group-hover:flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Remove"
                      >
                        ✕
                      </button>

                      {/* Label */}
                      <p className="text-[11px] text-text-muted text-center mt-1.5 truncate px-1">
                        {slide.mediaType === "video" ? "Video" : "Image"} #{idx + 1}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card footer */}
          <div className="px-6 py-4 border-t border-border bg-page flex items-center justify-end gap-3">
            <button
              onClick={() => router.push("/admin/media-slots")}
              className="text-sm font-medium text-text-secondary hover:text-navy transition-colors px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-2 bg-navy text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-navy/80 transition-colors disabled:opacity-50"
            >
              <span>💾</span>
              {saved ? "Saved!" : "Save Slider"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
