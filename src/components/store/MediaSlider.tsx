import { getMediaSlot } from "@/lib/data/storefront";
import MediaSliderClient from "./MediaSliderClient";
import { Image as ImageIcon } from "lucide-react";

export default async function MediaSlider({ slot }: { slot: string }) {
  const data = await getMediaSlot(slot);
  
  if (!data || data.slides.length === 0) {
    // Fallback: navy/gold design with a line icon
    return (
      <div className="w-full h-full min-h-[250px] bg-gradient-to-br from-navy to-navy-mid border border-gold/20 flex flex-col items-center justify-center p-8 text-center text-white relative rounded-2xl">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(201,150,12,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,150,12,0.5) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <ImageIcon className="h-10 w-10 text-gold opacity-80" strokeWidth={1.5} />
          {data?.label ? (
            <h3 className="font-display font-bold text-xl md:text-2xl text-gold-pale">{data.label}</h3>
          ) : (
            <h3 className="font-display font-bold text-xl md:text-2xl text-gold-pale">OKIKI Store</h3>
          )}
        </div>
      </div>
    );
  }

  return <MediaSliderClient data={data} />;
}
