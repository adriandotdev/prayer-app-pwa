import { LibraryLinks } from "@/components/home/library-links";
import { TodayDecades } from "@/components/home/today-decades";
import { TodayHero } from "@/components/home/today-hero";
import { getSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

async function isSignedIn() {
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
}

export default async function HomePage() {
  const signedIn = await isSignedIn();

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
