"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FAILED, OK, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth/require-user";
import { flash } from "@/lib/toast-flash";
import { formId } from "@/lib/validation";
import { prayerSchema } from "./schema";

export type PrayerField = "title" | "body" | "source";
export type PrayerFormState = { status: "idle" | "error"; message?: string; field?: PrayerField };

const SAVE_ERROR = "We couldn't save that. Please try again.";
const DELETE_ERROR = "We couldn't delete that prayer. Please try again.";

function parseForm(formData: FormData) {
  return prayerSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    source: String(formData.get("source") ?? ""),
  });
}

/** The first problem, tagged with the field it belongs to so the form can show it there. */
function invalid(error: { issues: { path: PropertyKey[]; message: string }[] }): PrayerFormState {
  const issue = error.issues[0];
  const field = issue?.path[0];
  return {
    status: "error",
    message: issue?.message,
    field: field === "title" || field === "body" || field === "source" ? field : undefined,
  };
}

export async function createPrayer(_prev: PrayerFormState, formData: FormData): Promise<PrayerFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return invalid(parsed.error);

  const { supabase, user } = await requireUser("/prayers/new");
  const { data, error } = await supabase
    .from("prayers")
    .insert({ user_id: user.id, title: parsed.data.title, body: parsed.data.body, source: parsed.data.source || null })
    .select("id")
    .single();
  if (error || !data) return { status: "error", message: SAVE_ERROR };

  revalidatePath("/prayers");
  await flash("Prayer added");
  redirect(`/prayers/${data.id}?added=1`);
}

export async function updatePrayer(_prev: PrayerFormState, formData: FormData): Promise<PrayerFormState> {
  const id = formId(formData);
  if (!id) return { status: "error", message: SAVE_ERROR };
  const parsed = parseForm(formData);
  if (!parsed.success) return invalid(parsed.error);

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
  await flash("Prayer saved");
  redirect(`/prayers/${id}`);
}

export async function deletePrayer(formData: FormData) {
  const id = formId(formData);
  if (!id) {
    await flash(DELETE_ERROR, "error");
    redirect("/prayers");
  }
  const { supabase, user } = await requireUser("/prayers");
  const { error } = await supabase.from("prayers").delete().eq("id", id).eq("user_id", user.id);
  if (error) {
    await flash(DELETE_ERROR, "error");
    redirect(`/prayers/${id}`);
  }

  revalidatePath("/prayers");
  await flash("Prayer deleted");
  redirect("/prayers");
}

/** Copies any visible prayer (usually a starter one) into the user's own library. */
export async function copyPrayer(formData: FormData) {
  const id = formId(formData);
  if (!id) redirect("/prayers");
  const { supabase, user } = await requireUser(`/prayers/${id}`);

  const { data: source } = await supabase.from("prayers").select("title, body, source").eq("id", id).maybeSingle();
  if (!source) redirect("/prayers");

  const { data: copy, error } = await supabase
    .from("prayers")
    .insert({ user_id: user.id, title: source.title, body: source.body, source: source.source })
    .select("id")
    .single();
  if (error || !copy) {
    await flash("We couldn't copy that prayer. Please try again.", "error");
    redirect(`/prayers/${id}`);
  }

  revalidatePath("/prayers");
  await flash("Copied to my prayers");
  redirect(`/prayers/${copy.id}`);
}

export async function toggleFavorite(formData: FormData): Promise<ActionResult> {
  const id = formId(formData);
  if (!id) return FAILED;
  const makeFavorite = formData.get("favorite") === "true";
  const { supabase, user } = await requireUser(`/prayers/${id}`);

  const { error } = makeFavorite
    ? await supabase.from("prayer_favorites").upsert({ user_id: user.id, prayer_id: id }, { ignoreDuplicates: true })
    : await supabase.from("prayer_favorites").delete().eq("user_id", user.id).eq("prayer_id", id);
  if (error) return FAILED;

  revalidatePath("/prayers", "layout");
  return OK;
}
