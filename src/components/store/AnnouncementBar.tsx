"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

// In Phase 5, this text will come from the settings table via a server prop.
// For Phase 1, it reads from a static default (or env-driven value).
const DEFAULT_MESSAGE = "🎉 Welcome to OKIKI Electronics Store — Your One-Stop Shop in Ibadan!";

interface AnnouncementBarProps {
  message?: string;
  bgColor?: string;
}

const DISMISS_KEY = "okiki_announcement_dismissed";

export default function AnnouncementBar({
  message = DEFAULT_MESSAGE,
  bgColor = "bg-navy",
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(false);

  // Check localStorage after hydration to avoid SSR mismatch
  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      className={`${bgColor} text-white text-sm py-2 px-4 relative`}
    >
      <p className="text-center pr-8 text-xs sm:text-sm font-medium">
        {message}
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors focus-visible:outline-gold"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
