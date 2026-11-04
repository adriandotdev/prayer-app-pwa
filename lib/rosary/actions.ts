"use server";

import { revalidatePath } from "next/cache";

import { MYSTERY_SET_ORDER } from "@/data/rosary/mysteries";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation";

export type RecordResult = "recorded" | "signed-out" | "rejected";

// A queued Rosary syncs within a week; anything much older is not a real offline session.
const MAX_AGE_MS = 31 * 24 * 60 * 60 * 1000;
const UNIQUE_VIOLATION = "23505";
const FK_VIOLATION = "23503";
const RLS_VIOLATION = "42501";

/**
 * Records a finished Rosary for a signed-in user. The Rosary is public, so signed-out
 * visitors are a no-op: history is a bonus, never a blocker. `completedAt` lets a Rosary
 * finished offline keep its real time when it syncs later; it must not be in the future or long past.
 * `clientId` makes a retry safe: recording the same one twice counts once.
 */
export async function recordRosarySession(
  setId: string,
  completedAt?: string,
  clientId?: string,
  intentionId?: string,
): Promise<RecordResult> {
  if (!(MYSTERY_SET_ORDER as readonly string[]).includes(setId)) return "rejected";
  if (clientId !== undefined && !isUuid(clientId)) return "rejected";
  // The link is a bonus: a malformed id just means the session is recorded unlinked.
  const intention = intentionId !== undefined && isUuid(intentionId) ? intentionId : undefined;

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

  const row = { user_id: user.id, mystery_set: setId, client_id: clientId, ...(when && { completed_at: when }) };
  let { error } = await supabase.from("rosary_sessions").insert({ ...row, intention_id: intention });
  // A deleted or foreign intention must not lose the Rosary: record it unlinked.
  if (error && intention && (error.code === FK_VIOLATION || error.code === RLS_VIOLATION)) {
    ({ error } = await supabase.from("rosary_sessions").insert(row));
  }
  // The same Rosary arriving twice is already on record.
  if (error?.code === UNIQUE_VIOLATION) return "recorded";
  if (error) {
    console.error("recordRosarySession insert failed:", error.code, error.message);
    return "rejected";
  }
  revalidatePath("/profile");
  return "recorded";
}
