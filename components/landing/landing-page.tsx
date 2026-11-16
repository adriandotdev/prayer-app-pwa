import "@/components/landing/landing.css";
import { Landing } from "@/components/landing/landing";
import { landingJsonLd } from "@/lib/seo-jsonld";

/** The signed-out landing page with its structured data. Shared by "/" and the cacheable /guest-home. */
export function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd()).replace(/</g, "\\u003c") }} />
      <Landing />
    </>
  );
}
