import type { Metadata } from "next";
import { cache } from "react";

import { Landing } from "@/components/landing/landing";
import "@/components/landing/landing.css";
import { LibraryLinks } from "@/components/home/library-links";
import { TodayDecades } from "@/components/home/today-decades";
import { TodayHero } from "@/components/home/today-hero";
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
  return {
    title: { absolute: "Ora — Draw near to God" },
    description:
      "Ora is a Catholic prayer app for a deeper faith: pray the Rosary, keep your own prayers, and come back to God each day.",
  };
}

export default async function HomePage() {
  const signedIn = await isSignedIn();
  if (!signedIn) return <Landing />;

  return (
    <div className="mx-auto grid max-w-3xl gap-4 lg:max-w-none lg:grid-cols-[22rem_1fr] lg:gap-8">
      <div className="ora-stagger contents">
        <div className="lg:h-full" style={{ ["--i" as string]: 0 }}>
          <TodayHero />
        </div>
        <div className="flex flex-col gap-4 lg:gap-8" style={{ ["--i" as string]: 1 }}>
          <TodayDecades />
          <LibraryLinks signedIn={signedIn} />
        </div>
      </div>
    </div>
  );
}
