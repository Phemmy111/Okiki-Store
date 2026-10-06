import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <span className="font-display text-3xl font-bold text-navy">OKIKI</span>
        <p className="text-text-secondary text-sm mt-1">Electronics Store</p>
      </div>
      <SignUp
        routing="hash"
        afterSignUpUrl="/"
        signInUrl="/sign-in"
        appearance={{
          elements: {
            card: "shadow-xl rounded-2xl border border-border",
            headerTitle: "font-display text-navy",
            formButtonPrimary: "bg-navy hover:bg-navy-mid text-white rounded-full",
          },
        }}
      />
    </div>
  );
}
