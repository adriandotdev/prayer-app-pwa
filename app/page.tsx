import type { Metadata } from "next";
import { cache } from "react";

import { Landing } from "@/components/landing/landing";
import "@/components/landing/landing.css";
import { MoreWaysToPray } from "@/components/home/more-ways-to-pray";
import { LibraryLinks } from "@/components/home/library-links";
import { LiturgicalDayCard } from "@/components/home/liturgical-day-card";
import { TodayDecades } from "@/components/home/today-decades";
import { TodayHero } from "@/components/home/today-hero";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { getSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const isSignedIn = cache(async () => {
  if (!getSupabaseEnv()) return false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user !== null;
  } catch {
    return false;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  if (await isSignedIn()) return {};
  return pageMetadata({
    title: "Ora",
    absoluteTitle: "Ora: Catholic Rosary & prayer app",
    description: SITE_DESCRIPTION,
    path: "/",
  });
}

export default async function HomePage() {
  const signedIn = await isSignedIn();
  if (!signedIn) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/brand/icon-512.png` },
        { "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION, inLanguage: "en", publisher: { "@id": `${SITE_URL}/#org` } },
        {
          "@type": "SoftwareApplication",
          name: SITE_NAME,
          url: SITE_URL,
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web",
          description: SITE_DESCRIPTION,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      ],
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Landing />
      </>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-4 lg:max-w-none lg:grid-cols-[22rem_1fr] lg:gap-8">
      <div className="ora-stagger contents">
        <div className="lg:sticky lg:top-8 lg:self-start" style={{ ["--i" as string]: 0 }}>
          <TodayHero />
        </div>
        <div className="flex flex-col gap-4 lg:gap-8" style={{ ["--i" as string]: 1 }}>
          <LiturgicalDayCard />
          <TodayDecades />
          <LibraryLinks signedIn={signedIn} />
          <MoreWaysToPray />
        </div>
      </div>
    </div>
  );
}
