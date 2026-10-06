import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Return Policy | OKIKI Electronics Store",
  description: "Read the return and exchange policy for products purchased from OKIKI Electronics Store.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <span className="inline-block bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold/20 mb-4">Legal</span>
        <h1 className="font-display text-4xl font-bold text-navy mb-2">Return Policy</h1>
        <p className="text-text-secondary text-sm">Last updated: October 2025</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
          <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="font-bold text-navy text-sm">7-Day Returns</p>
          <p className="text-xs text-text-secondary mt-1">For faulty or damaged items</p>
        </div>
        <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 text-center">
          <AlertTriangle className="w-8 h-8 text-gold mx-auto mb-2" />
          <p className="font-bold text-navy text-sm">Exchanges Available</p>
          <p className="text-xs text-text-secondary mt-1">For wrong or defective items</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
          <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="font-bold text-navy text-sm">No Change-of-Mind</p>
          <p className="text-xs text-text-secondary mt-1">Returns for personal preference</p>
        </div>
      </div>

      <div className="space-y-8 text-text-secondary leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">1. Eligible Returns</h2>
          <p>We accept returns within <strong>7 days</strong> of purchase for the following reasons:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>The item arrived damaged or defective</li>
            <li>The wrong item was delivered</li>
            <li>The item is significantly different from its description</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">2. Non-Returnable Items</h2>
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Items returned more than 7 days after purchase</li>
            <li>Items that have been used, installed, or modified</li>
            <li>Items without original packaging</li>
            <li>Custom or special-order products</li>
            <li>Items returned without proof of purchase</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">3. Condition of Returned Items</h2>
          <p>To qualify for a return or exchange, items must be:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>In original, unused condition</li>
            <li>In their original packaging with all accessories included</li>
            <li>Accompanied by proof of purchase (receipt or quote reference number)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">4. How to Initiate a Return</h2>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>Contact us via WhatsApp at <strong>+234 802 293 2216</strong> within 7 days of receiving your item</li>
            <li>Describe the issue and provide photos of the damage or defect</li>
            <li>Our team will assess and respond within 24 hours</li>
            <li>If approved, bring the item to our store in Ibadan for inspection</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">5. Refunds & Exchanges</h2>
          <p>Upon approval of a return:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Exchange:</strong> We will replace the defective item with the same model or equivalent</li>
            <li><strong>Refund:</strong> If a replacement is not available, a full refund will be processed within 3–5 business days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">6. Warranty</h2>
          <p>Many of our products come with manufacturer warranties. Warranty periods and coverage vary by product and are stated on the product page or on the physical product packaging. Warranty claims are handled directly with the manufacturer in some cases.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">7. Contact Us</h2>
          <p>Need to initiate a return or have questions? Contact us:</p>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/2348022932216?text=Hi%2C+I%27d+like+to+initiate+a+return."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Contact via WhatsApp
            </a>
            <Link href="/store" className="inline-flex items-center gap-2 border border-navy text-navy font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-navy hover:text-white transition-colors">
              Visit Our Store
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-4">
        <Link href="/privacy" className="text-sm text-gold hover:underline font-semibold">Privacy Policy →</Link>
        <Link href="/terms" className="text-sm text-gold hover:underline font-semibold">Terms of Service →</Link>
      </div>
    </div>
  );
}
