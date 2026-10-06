"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createSlide, deleteSlide, updateSlide } from "@/lib/actions/admin-media";

export default function MediaManagerClient({ 
  slots, 
  activeSlot, 
  slides,
  cloudName,
  apiKey 
}: { 
  slots: any[]; 
  activeSlot: any; 
  slides: any[];
  cloudName: string;
  apiKey: string;
}) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  
  // Quick hack to force reload script if needed, but Next.js Script handles it
  const openWidget = () => {
    if (typeof window === "undefined" || !(window as any).cloudinary) {
      alert("Cloudinary widget not loaded yet.");
      return;
    }
    
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName,
        uploadSignature: generateSignature,
        apiKey,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
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
      console.error(err);
    }
  };

  const handleUploadSuccess = async (info: any) => {
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
    if (!confirm("Are you sure you want to delete this slide?")) return;
    await deleteSlide(id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
      
      {/* Slot Selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border">
        <label className="block text-sm font-semibold text-navy mb-2">Select Slot to Manage</label>
        <select 
          className="w-full md:w-1/2 p-2 border border-border rounded-lg bg-page focus:outline-none focus:ring-2 focus:ring-gold/50"
          value={activeSlot?.id || ""}
          onChange={(e) => router.push(`?slotId=${e.target.value}`)}
        >
          {slots.map(s => (
            <option key={s.id} value={s.id}>{s.label} ({s.slug})</option>
          ))}
        </select>
      </div>

      {/* Active Slot Info & Slides */}
      {activeSlot && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-navy">{activeSlot.label} Slides</h2>
              <p className="text-sm text-text-secondary">Layout type: <span className="font-mono bg-page px-1 py-0.5 rounded">{activeSlot.layout}</span></p>
            </div>
            <button 
              onClick={openWidget}
              disabled={isUploading}
              className="bg-navy hover:bg-navy-mid text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {isUploading ? "Adding..." : "+ Upload New Media"}
            </button>
          </div>

          {slides.length === 0 ? (
            <div className="text-center py-12 bg-page rounded-xl border border-dashed border-border">
              <p className="text-text-secondary">No media uploaded for this slot yet.</p>
              <p className="text-xs text-text-muted mt-1">The storefront will display the default fallback image.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, idx) => (
                <div key={slide.id} className="flex gap-4 items-center p-4 bg-page rounded-xl border border-border">
                  <div className="w-24 h-24 shrink-0 bg-black/5 rounded-lg overflow-hidden flex items-center justify-center relative">
                     {slide.mediaType === "video" ? (
                       <>
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img
                           src={`https://res.cloudinary.com/${cloudName}/video/upload/w_200,h_200,c_fill,so_0/${slide.publicId}.jpg`}
                           alt="video thumbnail"
                           className="w-full h-full object-cover"
                           onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                         />
                         <span className="text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded absolute bottom-1 left-1">▶ VIDEO</span>
                       </>
                     ) : (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={`https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_200,c_fill/${slide.publicId}`} alt="thumb" className="w-full h-full object-cover" />
                     )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      placeholder="Custom Headline (optional)" 
                      className="w-full p-2 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-gold"
                      defaultValue={slide.headline || ""}
                      onBlur={(e) => updateSlide(slide.id, { headline: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Button Label" 
                        className="w-1/2 p-2 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-gold"
                        defaultValue={slide.btnLabel || ""}
                        onBlur={(e) => updateSlide(slide.id, { btnLabel: e.target.value })}
                      />
                      <input 
                        type="text" 
                        placeholder="Button URL" 
                        className="w-1/2 p-2 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-gold"
                        defaultValue={slide.btnUrl || ""}
                        onBlur={(e) => updateSlide(slide.id, { btnUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex flex-col gap-2">
                    <button 
                      onClick={() => handleDelete(slide.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold p-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
