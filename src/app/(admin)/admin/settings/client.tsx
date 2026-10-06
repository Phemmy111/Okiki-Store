"use client";
import { useState, useTransition } from "react";
import { saveSettingsAction } from "./actions";

const FIELDS = [
  {
    section: "Store Info",
    fields: [
      { key: "site.name", label: "Store Name", placeholder: "Okiki Electronics Store" },
      { key: "site.url", label: "Store URL", placeholder: "https://okiki-store.vercel.app" },
      { key: "site.email", label: "Brand Email", placeholder: "okikielectronicstore@gmail.com" },
      { key: "site.whatsapp_number", label: "WhatsApp Number", placeholder: "2348022932216", hint: "Include country code, no + or spaces" },
    ],
  },
  {
    section: "Contact & Location",
    fields: [
      { key: "site.address", label: "Store Address", placeholder: "Dugbe Alawo, Opposite Kamiluze Phase One, Ibadan" },
      { key: "site.phone1", label: "Phone Number 1", placeholder: "+2348022932216" },
      { key: "site.phone2", label: "Phone Number 2", placeholder: "+2348037283936" },
    ],
  },
  {
    section: "Social Media",
    fields: [
      { key: "site.instagram", label: "Instagram URL", placeholder: "https://instagram.com/okikistore" },
      { key: "site.facebook", label: "Facebook URL", placeholder: "https://facebook.com/okikistore" },
      { key: "site.twitter", label: "Twitter / X URL", placeholder: "https://twitter.com/okikistore" },
    ],
  },
];

export default function SettingsClient({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await saveSettingsAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const inputCls =
    "w-full border border-border rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white";
  const labelCls = "block text-sm font-semibold text-navy mb-1";
  const sectionCls = "bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {FIELDS.map(({ section, fields }) => (
        <div key={section} className={sectionCls}>
          <h2 className="font-bold text-navy text-base border-b border-border pb-3">{section}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ key, label, placeholder, hint }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input
                  name={key}
                  defaultValue={initialSettings[key] ?? ""}
                  placeholder={placeholder}
                  className={inputCls}
                />
                {hint && <p className="text-[11px] text-text-muted mt-1">{hint}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy text-white font-bold px-8 py-3 rounded-xl hover:bg-navy-mid transition-colors disabled:opacity-60"
        >
          {isPending ? "Saving..." : "💾 Save Settings"}
        </button>
        {saved && (
          <span className="text-green-600 font-semibold text-sm flex items-center gap-1">
            ✅ Settings saved successfully!
          </span>
        )}
      </div>
    </form>
  );
}
