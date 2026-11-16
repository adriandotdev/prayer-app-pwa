import "@/components/landing/landing.css";
import { Landing } from "@/components/landing/landing";
import { JsonLd } from "@/components/seo/json-ld";
import { landingJsonLd } from "@/lib/seo-jsonld";

/** The signed-out landing page with its structured data. Shared by "/" and the cacheable /guest-home. */
export function LandingPage() {
  return (
    <>
      <JsonLd data={landingJsonLd()} />
      <Landing />
    </>
  );
}
