import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { PageHeader } from "@/components/layout/page-header";
import { safeNext } from "@/lib/auth/paths";
import { getSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : undefined);
  const error = typeof params.error === "string" ? params.error : undefined;

  if (!getSupabaseEnv()) {
    return (
      <div className="mx-auto max-w-md">
        <PageHeader title="Sign in" />
        <p className="text-muted-foreground">Sign-in isn&apos;t configured yet. The Rosary still works without an account.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Sign in" description="Keep your prayers and intentions across devices. No password needed." />
      <LoginForm next={next} error={error} />
    </div>
  );
}
