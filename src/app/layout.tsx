import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// ── Fonts ─────────────────────────────────────────────────────────────────────
// CSS vars (--font-playfair, --font-inter) are injected into <html>
// and consumed by @theme in globals.css → font-display / font-sans utilities

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// ── Root Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    template: "%s | OKIKI Electronics Store",
    default:
      "OKIKI Electronics Store – Quality Products. Reliable Service. Trusted Dealer.",
  },
  description:
    "Your one-stop shop for salon & beauty equipment, home electronics, generators, and creator gear in Ibadan, Nigeria. Visit us at Dugbe Alawo, Ibadan.",
  keywords: [
    "salon equipment Ibadan",
    "electronics store Nigeria",
    "generator Ibadan Nigeria",
    "wholesale salon equipment Nigeria",
    "Okikiola electronics Ibadan",
    "beauty equipment Nigeria",
    "salon chair Nigeria",
    "standing dryer Nigeria",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "OKIKI Electronics Store",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── Root Layout ───────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-page font-sans text-text-primary">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
