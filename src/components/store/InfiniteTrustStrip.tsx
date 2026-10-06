import React from "react";
import {
  ShieldCheck, Truck, Tag, HeartHandshake, Headphones, 
  CreditCard, Award, CheckCircle, Package, Zap, Clock, ThumbsUp
} from "lucide-react";

const ROW_1 = [
  { icon: ShieldCheck, label: "Original Products" },
  { icon: Truck, label: "Swift Delivery" },
  { icon: Tag, label: "Best Prices" },
  { icon: HeartHandshake, label: "Wholesale Available" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: Award, label: "Top Quality" },
];

const ROW_2 = [
  { icon: CreditCard, label: "Secure Payment" },
  { icon: Package, label: "Careful Packaging" },
  { icon: CheckCircle, label: "Quality Assured" },
  { icon: Zap, label: "Fast Processing" },
  { icon: Clock, label: "On-time Delivery" },
  { icon: ThumbsUp, label: "Trusted Dealer" },
];

const ROW_3 = [
  { icon: HeartHandshake, label: "Dedicated Team" },
  { icon: ShieldCheck, label: "Warranty Support" },
  { icon: Truck, label: "Nationwide Shipping" },
  { icon: Tag, label: "Unbeatable Deals" },
  { icon: Award, label: "Premium Brands" },
  { icon: Headphones, label: "Expert Advice" },
];

function MarqueeRow({ items, reverse = false }: { items: typeof ROW_1, reverse?: boolean }) {
  const repeatedItems = [...items, ...items, ...items]; // Triple to ensure smooth infinite loop
  return (
    <div className="flex w-fit overflow-visible whitespace-nowrap group">
      <div className={`flex gap-4 md:gap-6 px-2 md:px-3 ${reverse ? "animate-marquee-right" : "animate-marquee-left"} group-hover:[animation-play-state:paused]`}>
        {repeatedItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white border border-border/50 shadow-sm rounded-2xl px-6 py-4 flex-shrink-0 transition-transform hover:scale-105"
          >
            <item.icon className="h-6 w-6 text-gold" />
            <span className="font-semibold text-navy text-sm md:text-base">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InfiniteTrustStrip() {
  return (
    <div className="w-full bg-navy-mid/5 border-y border-border py-12 md:py-16 overflow-hidden flex flex-col gap-4 md:gap-6 relative">
      <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-page to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-page to-transparent z-10 pointer-events-none" />
      
      <MarqueeRow items={ROW_1} />
      <MarqueeRow items={ROW_2} reverse />
      <MarqueeRow items={ROW_3} />
    </div>
  );
}
