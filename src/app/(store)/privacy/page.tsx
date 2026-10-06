import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | OKIKI Electronics Store",
  description: "Read our Privacy Policy to understand how OKIKI Electronics Store collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <span className="inline-block bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold/20 mb-4">Legal</span>
        <h1 className="font-display text-4xl font-bold text-navy mb-2">Privacy Policy</h1>
        <p className="text-text-secondary text-sm">Last updated: October 2025</p>
      </div>

      <div className="prose prose-navy max-w-none space-y-8 text-text-secondary leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">1. Information We Collect</h2>
          <p>When you submit a quote request or contact us through our website, we collect:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Your name and phone number</li>
            <li>Your business name (if provided)</li>
            <li>The products you are interested in</li>
            <li>Any message or notes you include</li>
          </ul>
          <p className="mt-3">We do not collect payment card details, as all transactions are conducted via WhatsApp or in-store.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">2. How We Use Your Information</h2>
          <p>Your information is used solely to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Respond to your quote requests and enquiries</li>
            <li>Contact you to discuss pricing and product availability</li>
            <li>Improve our products and services</li>
          </ul>
          <p className="mt-3">We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">3. Data Storage</h2>
          <p>Your quote requests are stored securely in our database hosted on Neon (PostgreSQL). We retain quote data for up to 12 months to enable follow-up and record-keeping. You may request deletion of your data at any time by contacting us on WhatsApp.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">4. Cookies</h2>
          <p>Our website uses minimal cookies to maintain your shopping session (e.g., your quote list is stored locally in your browser). We do not use tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">5. Third-Party Services</h2>
          <p>We use the following third-party services to power our store:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Cloudinary</strong> — for product image and video hosting</li>
            <li><strong>Vercel</strong> — for website hosting</li>
            <li><strong>Neon</strong> — for database storage</li>
            <li><strong>WhatsApp</strong> — for customer communication</li>
          </ul>
          <p className="mt-3">Each of these services has their own privacy policies which govern their use of your data.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Request access to the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, please contact us via WhatsApp.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy mb-3">7. Contact</h2>
          <p>If you have any questions about this Privacy Policy, please reach out to us:</p>
          <p className="mt-2"><strong>OKIKI Electronics Store</strong><br />Ibadan, Oyo State, Nigeria<br />WhatsApp: +234 802 293 2216</p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-4">
        <Link href="/terms" className="text-sm text-gold hover:underline font-semibold">Terms of Service →</Link>
        <Link href="/returns" className="text-sm text-gold hover:underline font-semibold">Return Policy →</Link>
      </div>
    </div>
  );
}
