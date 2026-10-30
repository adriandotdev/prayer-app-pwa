import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { ProfileForm } from "@/components/auth/profile-form";
import { SignOutForm } from "@/components/profile/sign-out-form";
import { RosaryHistory } from "@/components/rosary/history";
import { AppearanceRow } from "@/components/profile/appearance-row";
import { PageHeader } from "@/components/layout/page-header";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();

  return (
    <div className="mx-auto max-w-md lg:max-w-5xl">
      <PageHeader title="Profile" description={user.email ?? undefined} />
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="flex flex-col gap-4 lg:gap-8">
          <Reveal index={0}>
            <section aria-label="Your details" className="rounded-3xl bg-card p-5 md:p-8">
              <ProfileForm displayName={profile?.display_name ?? ""} />
            </section>
          </Reveal>
          <Reveal index={3}>
            <SignOutForm action={signOut} />
          </Reveal>
        </div>
        <div className="flex flex-col gap-4 lg:gap-8">
          <Reveal index={1}>
            <div className="rounded-3xl bg-card p-5 md:p-8">
              <RosaryHistory />
            </div>
          </Reveal>
          <Reveal index={2}>
            <AppearanceRow />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
