"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { FAILED, OK, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { status: "idle" | "saved" | "error"; message?: string };

const schema = z.object({ displayName: z.string().trim().max(60, "Keep your name under 60 characters.") });

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const parsed = schema.safeParse({ displayName: String(formData.get("displayName") ?? "") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: parsed.data.displayName || null })
    .eq("id", user.id);
  if (error) return { status: "error", message: "We couldn't save that. Please try again." };

  revalidatePath("/profile");
  return { status: "saved" };
}

/**
 * Permanently deletes the signed-in account. Every user table cascades from auth.users, so
 * removing the auth user erases prayers, collections, intentions, favorites and Rosary history.
 * The caller clears device data and navigates once this reports ok.
 */
export async function deleteAccount(): Promise<ActionResult> {
  const { supabase, user } = await requireUser("/profile");

  try {
    const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
    if (error) {
      console.error("deleteAccount failed", error.message);
      return FAILED;
    }
  } catch (error) {
    console.error("deleteAccount failed", error instanceof Error ? error.message : error);
    return FAILED;
  }

  // The user no longer exists server-side; drop the session cookies. Local scope avoids a
  // network call for a session that has already been revoked.
  await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
  return OK;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
