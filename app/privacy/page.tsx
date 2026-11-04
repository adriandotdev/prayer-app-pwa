import type { Metadata } from "next";
import Link from "next/link";

import { ContactLine, LegalPage, LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description: "What Ora collects, why, who processes it, and how to download or delete your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="Your prayers are personal. This explains what Ora keeps, why, and how you stay in control."
    >
      <LegalSection title="What we collect">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Account:</strong> your name and email address from Google when you sign in. We never see your Google password.
          </li>
          <li>
            <strong>Your content:</strong> prayers you write, collections, favorites, prayer intentions and your Rosary history.
          </li>
          <li>
            <strong>On your device:</strong> settings, progress and drafts are kept in your browser&apos;s storage so Ora works offline.
          </li>
          <li>
            <strong>Usage:</strong> aggregate page-view statistics through Vercel Analytics, which does not use cookies or identify you.
          </li>
        </ul>
        <p>
          Prayer intentions and Rosary history can reveal religious belief, which is sensitive personal information. We process it only to
          provide the app to you, and only with your consent given when you sign in.
        </p>
      </LegalSection>

      <LegalSection title="Why we use it">
        <p>
          To sign you in, save and sync your content across devices, and keep the app secure. We do not sell your data, show ads or use your
          intentions for any other purpose. Only you can read your content.
        </p>
      </LegalSection>

      <LegalSection title="Who processes it">
        <ul className="list-disc space-y-2 pl-6">
          <li>Supabase: authentication and database hosting.</li>
          <li>Vercel: website hosting and Vercel Analytics.</li>
          <li>Google: sign-in.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Under the Philippines Data Privacy Act and applicable US state laws you may access, correct, download and delete your data, and
          withdraw consent. In Ora, open your <Link href="/profile" className="underline underline-offset-4">profile</Link> to download your
          data as a file or delete your account. Deletion is immediate and permanent. You may also complain to the Philippines National
          Privacy Commission.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>Until you delete your account. Backups held by our database provider are overwritten on their normal schedule.</p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions or requests: <ContactLine />. If a breach affects your data we will notify you and the relevant authority as the law
          requires.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
