import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | OKIKI Electronics Store",
  description: "Read the Terms of Service governing the use of the OKIKI Electronics Store website.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <span className="inline-block bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold/20 mb-4">Legal</span>
        <h1 className="font-display text-4xl font-bold text-navy mb-2">Terms of Service</h1>
        <p className="text-text-secondary text-sm">Last updated: October 2025</p>
      </div>

      <div className="space-y-8 text-text-secondary leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using the OKIKI Electronics Store website (<strong>okiki-store.vercel.app</strong>), you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">2. Use of the Website</h2>
          <p>This website is intended for browsing products and submitting quote requests. You agree to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Provide accurate and honest information when submitting quote requests</li>
            <li>Not use the site for any unlawful or fraudulent purpose</li>
            <li>Not attempt to disrupt or interfere with the operation of the site</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">3. Pricing & Availability</h2>
          <p>Product prices displayed on this site are indicative and subject to change without notice. Final pricing will be confirmed via WhatsApp or in-store communication. We reserve the right to refuse or cancel any order due to stock availability, pricing errors, or any other reason.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">4. Quote Requests</h2>
          <p>Submitting a quote request does not constitute a purchase or binding agreement. It is an expression of interest. A sale is only confirmed once payment has been agreed upon and received.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">5. Intellectual Property</h2>
          <p>All content on this website — including product images, logos, descriptions, and design — is the property of OKIKI Electronics Store and may not be reproduced, distributed, or used without express written permission.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">6. Limitation of Liability</h2>
          <p>OKIKI Electronics Store is not liable for any indirect, incidental, or consequential damages arising from the use of this website or its content. The website is provided &quot;as is&quot; without warranties of any kind.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">7. Changes to These Terms</h2>
          <p>We reserve the right to update these Terms at any time. Continued use of the site after changes constitutes your acceptance of the revised terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">8. Contact</h2>
          <p>Questions about these Terms? Reach us via WhatsApp at <strong>+234 802 293 2216</strong> or visit our store in Ibadan, Oyo State, Nigeria.</p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-4">
        <Link href="/privacy" className="text-sm text-gold hover:underline font-semibold">Privacy Policy →</Link>
        <Link href="/returns" className="text-sm text-gold hover:underline font-semibold">Return Policy →</Link>
      </div>
    </div>
  );
}
