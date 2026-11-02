import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";
import { isUuid } from "@/lib/validation";

export type Intention = Pick<Tables<"intentions">, "id" | "text" | "is_answered" | "answered_at" | "created_at">;

const COLUMNS = "id, text, is_answered, answered_at, created_at";

/** RLS limits rows to the signed-in user's own intentions. */
export async function listIntentions(): Promise<{ active: Intention[]; answered: Intention[] }> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("intentions").select(COLUMNS).order("created_at", { ascending: false });
  if (error) throw new Error("Could not load intentions.");
  const all = data ?? [];
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
