import type { Metadata } from "next";
import { Cross } from "lucide-react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { PageHeader } from "@/components/layout/page-header";
import { safeNext } from "@/lib/auth/paths";
import { getSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign in" };

/** The chapel window beside the form on wide screens; on a phone it is a small crest above the title. */
function Window() {
  return (
    <div
      aria-hidden
      className="ora-arch relative isolate mx-auto mb-8 flex h-28 w-24 items-end justify-center overflow-hidden rounded-b-2xl bg-primary pb-6 text-gold dark:bg-secondary lg:mb-0 lg:h-full lg:min-h-[28rem] lg:w-full lg:items-center lg:pb-0 lg:rounded-b-[1.75rem]"
    >
      <span className="ora-candle absolute -z-10 size-24 rounded-full bg-gold/15 lg:size-40" />
      <Cross className="size-8 lg:size-14" strokeWidth={1.5} />
    </div>
  );
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : undefined);
  const error = typeof params.error === "string" ? params.error : undefined;

  if (!getSupabaseEnv()) {
    return (
      <div className="mx-auto max-w-md">
        <Window />
        <PageHeader title="Sign in" />
        <p className="text-lg text-muted-foreground">Sign-in isn&apos;t configured yet. The Rosary still works without an account.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <div className="mx-auto max-w-md lg:grid lg:max-w-4xl lg:grid-cols-[18rem_1fr] lg:items-stretch lg:gap-14">
      <Window />
      <div className="lg:flex lg:flex-col lg:justify-center">
        <PageHeader title="Sign in" description="Keep your prayers and intentions across devices. No password needed." />
        <LoginForm next={next} error={error} />
      </div>
    </div>
  );
}
