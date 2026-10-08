import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/** For server actions: returns the Supabase client and user, or sends the visitor to sign in. */
export async function requireUser(next: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${next}`);
  return { supabase, user };
}
