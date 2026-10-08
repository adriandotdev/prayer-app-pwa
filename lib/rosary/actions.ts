"use server";

import { revalidatePath } from "next/cache";

import { MYSTERY_SET_ORDER } from "@/data/rosary/mysteries";
import { createClient } from "@/lib/supabase/server";

/**
 * Records a finished Rosary for a signed-in user. The Rosary is public, so signed-out
 * visitors (and any failure) are a silent no-op: history is a bonus, never a blocker.
 */
export async function recordRosarySession(setId: string): Promise<void> {
  if (!(MYSTERY_SET_ORDER as readonly string[]).includes(setId)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("rosary_sessions").insert({ user_id: user.id, mystery_set: setId });
  if (!error) revalidatePath("/profile");
}
