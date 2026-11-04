import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";
import { isUuid } from "@/lib/validation";

export type Intention = Pick<Tables<"intentions">, "id" | "text" | "is_answered" | "answered_at" | "created_at"> & {
  /** Rosaries prayed for this intention. Only filled by `listIntentions`. */
  prayed_count?: number;
  last_prayed_at?: string | null;
};

const COLUMNS = "id, text, is_answered, answered_at, created_at";

/** RLS limits rows to the signed-in user's own intentions. */
export async function listIntentions(): Promise<{ active: Intention[]; answered: Intention[] }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("intentions")
    .select(`${COLUMNS}, rosary_sessions(completed_at)`)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load intentions.");
  const all: Intention[] = (data ?? []).map(({ rosary_sessions, ...intention }) => ({
    ...intention,
    prayed_count: rosary_sessions.length,
    last_prayed_at: rosary_sessions.reduce<string | null>((max, s) => (!max || s.completed_at > max ? s.completed_at : max), null),
  }));
  return {
    active: all.filter((i) => !i.is_answered),
    answered: all.filter((i) => i.is_answered).sort((a, b) => (b.answered_at ?? "").localeCompare(a.answered_at ?? "")),
  };
}

export async function getIntention(id: string): Promise<Intention | null> {
  if (!isUuid(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("intentions").select(COLUMNS).eq("id", id).maybeSingle();
  return data;
}
