"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";
import { intentionSchema } from "./schema";

export type IntentionFormState = { status: "idle" | "error"; message?: string };

const SAVE_ERROR = "We couldn't save that. Please try again.";

function parseForm(formData: FormData) {
  return intentionSchema.safeParse({ text: String(formData.get("text") ?? "") });
}

export async function createIntention(_prev: IntentionFormState, formData: FormData): Promise<IntentionFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { supabase, user } = await requireUser("/intentions/new");
  const { error } = await supabase.from("intentions").insert({ user_id: user.id, text: parsed.data.text });
  if (error) return { status: "error", message: SAVE_ERROR };

  revalidatePath("/intentions");
  redirect("/intentions");
}

export async function updateIntention(_prev: IntentionFormState, formData: FormData): Promise<IntentionFormState> {
  const id = String(formData.get("id") ?? "");
  const parsed = parseForm(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { supabase, user } = await requireUser(`/intentions/${id}/edit`);
  const { data, error } = await supabase
    .from("intentions")
    .update({ text: parsed.data.text })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");
  if (error || !data?.length) return { status: "error", message: SAVE_ERROR };

  revalidatePath("/intentions");
  redirect("/intentions");
}

export async function setIntentionAnswered(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const answered = formData.get("answered") === "true";
  const { supabase, user } = await requireUser("/intentions");

  await supabase
    .from("intentions")
    .update({ is_answered: answered, answered_at: answered ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/intentions");
}

export async function deleteIntention(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await requireUser("/intentions");
  await supabase.from("intentions").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/intentions");
}
