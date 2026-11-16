import type { Metadata } from "next";
import { cache } from "react";

import { LandingPage } from "@/components/landing/landing-page";
import { MoreWaysToPray } from "@/components/home/more-ways-to-pray";
import { LibraryLinks } from "@/components/home/library-links";
import { LiturgicalDayCard } from "@/components/home/liturgical-day-card";
import { TodayDecades } from "@/components/home/today-decades";
import { TodayHero } from "@/components/home/today-hero";
import { landingMetadata } from "@/lib/landing-metadata";
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
  return landingMetadata();
}

export default async function HomePage() {
  const signedIn = await isSignedIn();
  if (!signedIn) return <LandingPage />;

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
