import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/auth/profile-form";
import { SignOutForm } from "@/components/profile/sign-out-form";
import { RosaryHistory } from "@/components/rosary/history";
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
    <div className="mx-auto max-w-md">
      <PageHeader title="Profile" description={user.email ?? undefined} />
      <div className="flex flex-col gap-8">
        <ProfileForm displayName={profile?.display_name ?? ""} />
        <RosaryHistory />
        <SignOutForm action={signOut} />
      </div>
    </div>
  );
}
