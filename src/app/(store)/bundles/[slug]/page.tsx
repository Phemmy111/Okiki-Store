import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getBundles, getBundleBySlug, getMediaSlot, getStoreSettings } from "@/lib/data/storefront";
import MediaSlider from "@/components/store/MediaSlider";
import { buildCloudinaryUrl } from "@/lib/cloudinary-client";
import { ChevronRight } from "lucide-react";
import AddToQuoteButton from "@/components/store/AddToQuoteButton";
import BundleItemsList from "@/components/store/BundleItemsList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);
  if (!bundle) return { title: "Bundle Not Found" };
  return { title: `${bundle.name} Bundle`, description: bundle.description ?? undefined };
}

export default async function BundlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [bundle, settings] = await Promise.all([
    getBundleBySlug(slug),
    getStoreSettings(),
  ]);

  if (!bundle) notFound();

  const waNumber = settings["site.whatsapp_number"] ?? "2348022932216";
  const isStandard = bundle.slug === "standard";

  const price = bundle.priceKobo ? Number(bundle.priceKobo) / 100 : null;

  const waMessage = `Hi, I'm interested in the *${bundle.name} Bundle*.\nItems:\n${bundle.items.map((i) => `• ${i.qty}x ${i.product?.name ?? "item"}`).join("\n")}\n${price ? `Total: ₦${price.toLocaleString()}` : "Price: to be confirmed"}`;

  return (
    <>
      {/* Banner Slot */}
      <div className="w-full">
        <MediaSlider slot={`bundle-${slug}`} />
      </div>

      {/* Breadcrumb */}
      <div className="bg-navy border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center text-sm text-white/60">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/bundles" className="hover:text-white transition-colors">Bundles</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-white font-medium">{bundle.name}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-navy">
            {bundle.name} Bundle
          </h1>
          {isStandard && (
            <span className="bg-gold text-navy font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
              Most Popular
            </span>
          )}
        </div>

        {bundle.description && (
          <p className="text-text-secondary text-lg mb-10 max-w-2xl">{bundle.description}</p>
        )}

        {/* Items List */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-6">
          <h2 className="font-display font-bold text-2xl text-navy">
            What's Included
          </h2>
          <span className="text-xs text-text-muted">Click any item to view full details</span>
        </div>

        <BundleItemsList items={bundle.items} />

        {/* Pricing and CTA */}
        <div className={`rounded-2xl p-8 text-center shadow-md ${isStandard ? "border-2 border-gold bg-gold/5" : "bg-card border border-border"}`}>
          <div className="mb-6">
            {price ? (
              <p className="font-display font-bold text-4xl text-navy">
                ₦{price.toLocaleString()}
              </p>
            ) : (
              <p className="font-display font-bold text-2xl text-navy">Price to be confirmed</p>
            )}
            <p className="text-text-secondary text-sm mt-1">
              {bundle.items.length} item{bundle.items.length !== 1 ? "s" : ""} included
            </p>
          </div>

          <div className="w-full max-w-sm mt-6">
              <AddToQuoteButton
                productId={-bundle.id}
                name={bundle.name + " Bundle"}
                slug={"bundle-" + bundle.slug}
                priceKobo={bundle.priceKobo}
                imagePublicId={null}
                variant="detail"
              />
            </div>
        </div>
      </div>
    </>
  );
}
