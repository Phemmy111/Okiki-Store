import AnnouncementBar from "@/components/store/AnnouncementBar";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import MobileStickyBar from "@/components/store/MobileStickyBar";
import FloatingWhatsApp from "@/components/store/FloatingWhatsApp";

export default function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />

      {/* Always-visible mobile quick-action bar */}
      <MobileStickyBar />

      {/* Floating WhatsApp button — above mobile sticky bar */}
      <FloatingWhatsApp />
    </>
  );
}
