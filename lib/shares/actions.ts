"use server";

import { revalidatePath } from "next/cache";

import { FAILED, OK, saveErrorMessage, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth/require-user";
import { isSeasonChoice, type SeasonChoice } from "@/lib/theme/season";
import { createClient } from "@/lib/supabase/server";
import { formId } from "@/lib/validation";
import type { ShareKind } from "./queries";

export type ShareResult = { ok: true; token: string } | { ok: false; message: string };

const SHARE_ERROR = "We couldn't create that link. Please try again.";

function kindOf(formData: FormData): ShareKind | null {
  const kind = formData.get("kind");
  return kind === "prayer" || kind === "collection" ? kind : null;
}

/** The sharer's colour choice sent by the share button; anything unrecognised means Ora's own palette. */
function seasonOf(formData: FormData): SeasonChoice {
  const season = formData.get("season");
  return isSeasonChoice(season) ? season : "default";
}

/** Returns the item's share link token, creating it on first use. Only the owner's own items match. */
export async function createShare(formData: FormData): Promise<ShareResult> {
  const id = formId(formData);
  const kind = kindOf(formData);
  if (!id || !kind) return { ok: false, message: SHARE_ERROR };

  const { supabase, user } = await requireUser(kind === "prayer" ? `/prayers/${id}` : `/collections/${id}`);
  const column = kind === "prayer" ? "prayer_id" : "collection_id";

  const season = seasonOf(formData);
  const existing = await supabase.from("shares").select("token, season").eq(column, id).maybeSingle();
  if (existing.data) {
    // Reopening a link refreshes its look to the sharer's current colours. A failure here is harmless: the old look stays.
    if (existing.data.season !== season) await supabase.from("shares").update({ season }).eq(column, id).eq("user_id", user.id);
    return { ok: true, token: existing.data.token };
  }

  const { data, error } = await supabase
    .from("shares")
    .insert(kind === "prayer" ? { user_id: user.id, prayer_id: id, season } : { user_id: user.id, collection_id: id, season })
    .select("token")
    .single();
  if (error || !data) return { ok: false, message: saveErrorMessage(error, "shared links", SHARE_ERROR) };
  return { ok: true, token: data.token };
}

/** Stops sharing: the old link stops working at once. Sharing again gives a new link. */
export async function revokeShare(formData: FormData): Promise<ActionResult> {
  const id = formId(formData);
  const kind = kindOf(formData);
  if (!id || !kind) return FAILED;

  const { supabase, user } = await requireUser(kind === "prayer" ? `/prayers/${id}` : `/collections/${id}`);
  const { error } = await supabase
    .from("shares")
    .delete()
    .eq(kind === "prayer" ? "prayer_id" : "collection_id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false, message: "We couldn't stop sharing. Please try again." };

  revalidatePath(kind === "prayer" ? `/prayers/${id}` : `/collections/${id}`);
  return OK;
}

/**
 * Brings every link the signed-in user has shared in line with the colours they just saved, so a
 * link doesn't keep an older look until its Share sheet is next opened. Signed-out visitors have
 * no links, and a failure is harmless: the links keep their previous look.
 */
export async function syncShareSeasons(season: string): Promise<{ updated: number; error?: string }> {
  if (!isSeasonChoice(season)) return { updated: 0, error: "invalid season" };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { updated: 0, error: "not signed in" };
  const { data, error } = await supabase.from("shares").update({ season }).eq("user_id", user.id).neq("season", season).select("token");
  if (error) console.error("syncShareSeasons failed:", error.message);
  return { updated: data?.length ?? 0, error: error?.message };
}
