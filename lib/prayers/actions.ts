"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prayerSchema } from "./schema";

export type PrayerFormState = { status: "idle" | "error"; message?: string };

const SAVE_ERROR = "We couldn't save that. Please try again.";

async function requireUser(next: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${next}`);
  return { supabase, user };
}

function parseForm(formData: FormData) {
  return prayerSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    source: String(formData.get("source") ?? ""),
  });
}

export async function createPrayer(_prev: PrayerFormState, formData: FormData): Promise<PrayerFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { supabase, user } = await requireUser("/prayers/new");
  const { data, error } = await supabase
    .from("prayers")
    .insert({ user_id: user.id, title: parsed.data.title, body: parsed.data.body, source: parsed.data.source || null })
    .select("id")
    .single();
  if (error || !data) return { status: "error", message: SAVE_ERROR };

  revalidatePath("/prayers");
  redirect(`/prayers/${data.id}`);
}

export async function updatePrayer(_prev: PrayerFormState, formData: FormData): Promise<PrayerFormState> {
  const id = String(formData.get("id") ?? "");
  const parsed = parseForm(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { supabase, user } = await requireUser(`/prayers/${id}/edit`);
  // user_id filter + RLS: starter prayers and other people's prayers match nothing.
  const { data, error } = await supabase
    .from("prayers")
    .update({ title: parsed.data.title, body: parsed.data.body, source: parsed.data.source || null })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");
  if (error || !data?.length) return { status: "error", message: SAVE_ERROR };

  revalidatePath("/prayers");
  redirect(`/prayers/${id}`);
}

export async function deletePrayer(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await requireUser("/prayers");
  await supabase.from("prayers").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/prayers");
  redirect("/prayers");
}

/** Copies any visible prayer (usually a starter one) into the user's own library. */
export async function copyPrayer(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await requireUser(`/prayers/${id}`);

  const { data: source } = await supabase.from("prayers").select("title, body, source").eq("id", id).maybeSingle();
  if (!source) redirect("/prayers");

  const { data: copy } = await supabase
    .from("prayers")
    .insert({ user_id: user.id, title: source.title, body: source.body, source: source.source })
    .select("id")
    .single();

  revalidatePath("/prayers");
  redirect(copy ? `/prayers/${copy.id}` : "/prayers");
}

export async function toggleFavorite(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const makeFavorite = formData.get("favorite") === "true";
  const { supabase, user } = await requireUser(`/prayers/${id}`);

  if (makeFavorite) {
    await supabase.from("prayer_favorites").upsert({ user_id: user.id, prayer_id: id }, { ignoreDuplicates: true });
  } else {
    await supabase.from("prayer_favorites").delete().eq("user_id", user.id).eq("prayer_id", id);
  }
  revalidatePath("/prayers", "layout");
}
