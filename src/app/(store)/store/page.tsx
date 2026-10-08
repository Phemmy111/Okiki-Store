import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { getStoreSettings } from "@/lib/data/storefront";

export const metadata: Metadata = {
  title: "Visit Our Store | OKIKI Electronics",
  description: "Visit OKIKI Electronics Store in Ibadan. Find our location, opening hours, and contact details.",
};

export default async function VisitStorePage() {
  const settings = await getStoreSettings();
  const waNumber = (settings["site.whatsapp_number"] ?? "2348022932216").replace(/\D/g, "");
  const address = settings["site.address"] ?? "Ibadan, Oyo State, Nigeria";
  const phone1 = settings["site.phone1"] ?? "+234 802 293 2216";
  const phone2 = settings["site.phone2"] ?? "+234 803 728 3936";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold/20 mb-4">
          Find Us
        </span>
        <h1 className="font-display text-4xl font-bold text-navy mb-3">Visit Our Store</h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          Come see our full range of electronics, salon equipment, generators and more — in person!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Info Cards */}
        <div className="space-y-5">
          {/* Location */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex gap-4">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-bold text-navy mb-1">Our Location</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{address}</p>
              <a
                href="https://maps.app.goo.gl/w5uo6RF61C95iSdP7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-gold font-semibold hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex gap-4">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-bold text-navy mb-1">Call Us</h3>
              <a href={`tel:${phone1.replace(/\s/g, "")}`} className="block text-sm text-text-secondary hover:text-navy transition-colors">{phone1}</a>
              <a href={`tel:${phone2.replace(/\s/g, "")}`} className="block text-sm text-text-secondary hover:text-navy transition-colors mt-0.5">{phone2}</a>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex gap-4">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-bold text-navy mb-2">Opening Hours</h3>
              <div className="space-y-1">
                {[
                  { day: "Mon – Fri", time: "9:00am – 6:00pm" },
                  { day: "Saturday", time: "9:00am – 5:00pm" },
                  { day: "Sunday", time: "Closed" },
                ].map(({ day, time }) => (
                  <div key={day} className="flex justify-between gap-6 text-sm">
                    <span className="text-text-secondary">{day}</span>
                    <span className={`font-medium ${time === "Closed" ? "text-red-500" : "text-navy"}`}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex gap-4 items-center" id="contact">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-navy mb-0.5">Chat on WhatsApp</h3>
              <p className="text-sm text-text-secondary mb-3">Get a quick response before visiting</p>
              <a
                href={`https://wa.me/${waNumber}?text=Hi%2C+I%27d+like+to+visit+your+store.+Can+you+confirm+your+location+and+availability%3F`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Message Us on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Map embed */}
        <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-full min-h-[400px]">
          <iframe
            title="OKIKI Store Location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            className="w-full h-full min-h-[400px]"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-text-secondary mb-4">Prefer to browse first?</p>
        <Link href="/shop" className="bg-navy text-white font-bold px-8 py-3 rounded-full hover:bg-navy-mid transition-colors">
          Shop Online
        </Link>
      </div>
    </div>
  );
}
