"use server";

import { revalidatePath } from "next/cache";

import { MYSTERY_SET_ORDER } from "@/data/rosary/mysteries";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation";

export type RecordResult = "recorded" | "signed-out" | "rejected";

// A queued Rosary syncs within a week; anything much older is not a real offline session.
const MAX_AGE_MS = 31 * 24 * 60 * 60 * 1000;
const UNIQUE_VIOLATION = "23505";

/**
 * Records a finished Rosary for a signed-in user. The Rosary is public, so signed-out
 * visitors are a no-op: history is a bonus, never a blocker. `completedAt` lets a Rosary
 * finished offline keep its real time when it syncs later; it must not be in the future or long past.
 * `clientId` makes a retry safe: recording the same one twice counts once.
 */
export async function recordRosarySession(setId: string, completedAt?: string, clientId?: string): Promise<RecordResult> {
  if (!(MYSTERY_SET_ORDER as readonly string[]).includes(setId)) return "rejected";
  if (clientId !== undefined && !isUuid(clientId)) return "rejected";

  let when: string | undefined;
  if (completedAt !== undefined) {
    const time = Date.parse(completedAt);
    if (Number.isNaN(time) || time > Date.now() + 60_000 || time < Date.now() - MAX_AGE_MS) return "rejected";
    when = new Date(time).toISOString();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "signed-out";

  const { error } = await supabase
    .from("rosary_sessions")
    .insert({ user_id: user.id, mystery_set: setId, client_id: clientId, ...(when && { completed_at: when }) });
  // The same Rosary arriving twice is already on record.
  if (error?.code === UNIQUE_VIOLATION) return "recorded";
  if (error) return "rejected";
  revalidatePath("/profile");
  return "recorded";
}
