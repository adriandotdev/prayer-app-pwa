"use server";

import { revalidatePath } from "next/cache";

import { MYSTERY_SET_ORDER } from "@/data/rosary/mysteries";
import { createClient } from "@/lib/supabase/server";

export type RecordResult = "recorded" | "signed-out" | "rejected";

/**
 * Records a finished Rosary for a signed-in user. The Rosary is public, so signed-out
 * visitors are a no-op: history is a bonus, never a blocker. `completedAt` lets a Rosary
 * finished offline keep its real time when it syncs later; it must not be in the future.
 */
export async function recordRosarySession(setId: string, completedAt?: string): Promise<RecordResult> {
  if (!(MYSTERY_SET_ORDER as readonly string[]).includes(setId)) return "rejected";

  let when: string | undefined;
  if (completedAt !== undefined) {
    const time = Date.parse(completedAt);
    if (Number.isNaN(time) || time > Date.now() + 60_000) return "rejected";
    when = new Date(time).toISOString();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "signed-out";

  const { error } = await supabase
    .from("rosary_sessions")
    .insert({ user_id: user.id, mystery_set: setId, ...(when && { completed_at: when }) });
  if (error) return "rejected";
  revalidatePath("/profile");
  return "recorded";
}
