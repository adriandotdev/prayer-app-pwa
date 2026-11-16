import type { Metadata } from "next";
import Link from "next/link";

import { ContactLine, LegalPage, LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of service",
  description: "The terms for using Ora.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" intro="Plain terms for using Ora. By signing in you agree to them.">
      <LegalSection title="Using Ora">
        <p>
          Ora is a prayer app. The Rosary and guides are free to use without an account. Signing in lets you keep your own prayers,
          collections and intentions. Keep your account secure and use Ora lawfully and respectfully.
        </p>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          What you write is yours. You give us permission only to store and show it back to you. Do not store anything unlawful or that
          infringes someone else&apos;s rights. If you share a prayer or collection by link, anyone with the link can read it until you stop
          sharing, so share only what you are happy for others to see.
        </p>
      </LegalSection>

      <LegalSection title="Our content">
        <p>
          Ora&apos;s design, code and original text belong to us. Traditional prayers and public-domain artwork remain in the public
          domain.
        </p>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          Ora is provided as is. It is a devotional aid, not a substitute for the Church, the sacraments or spiritual direction. We may
          change or stop the service, and will give notice where we reasonably can.
        </p>
      </LegalSection>

      <LegalSection title="Ending your account">
        <p>
          You can delete your account at any time from your <Link href="/profile" className="underline underline-offset-4">profile</Link>.
          We may suspend accounts that abuse the service.
        </p>
      </LegalSection>

      <LegalSection title="Privacy and contact">
        <p>
          See the <Link href="/privacy" className="underline underline-offset-4">privacy policy</Link> for how we handle data. Questions:{" "}
          <ContactLine />.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
