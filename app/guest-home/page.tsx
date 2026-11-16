import { LandingPage } from "@/components/landing/landing-page";
import { landingMetadata } from "@/lib/landing-metadata";

// Never linked. proxy.ts rewrites "/" here for visitors with no Supabase cookie, so the landing page is
// prerendered and CDN-cached instead of rendering per request. The canonical stays "/".
export const metadata = landingMetadata();

export default function GuestHomePage() {
  return <LandingPage />;
}
