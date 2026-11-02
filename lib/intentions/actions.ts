"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FAILED, OK, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth/require-user";
import { flash } from "@/lib/toast-flash";
import { formId } from "@/lib/validation";
import { intentionSchema } from "./schema";

export type IntentionFormState = { status: "idle" | "error"; message?: string };

const SAVE_ERROR = "We couldn't save that. Your words are still here, so try again.";

function parseForm(formData: FormData) {
  return intentionSchema.safeParse({ text: String(formData.get("text") ?? "") });
}

export async function createIntention(_prev: IntentionFormState, formData: FormData): Promise<IntentionFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { supabase, user } = await requireUser("/intentions/new");
  const { data, error } = await supabase
    .from("intentions")
    .insert({ user_id: user.id, text: parsed.data.text })
    .select("id")
    .single();
  if (error || !data) return { status: "error", message: SAVE_ERROR };

  revalidatePath("/intentions");
  await flash("Intention added");
  // The list lights the new card once, and clears the saved draft.
  redirect(`/intentions?added=${data.id}`);
}

export async function updateIntention(_prev: IntentionFormState, formData: FormData): Promise<IntentionFormState> {
  const id = formId(formData);
  if (!id) return { status: "error", message: SAVE_ERROR };
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
  await flash("Intention saved");
  redirect("/intentions");
}

export async function setIntentionAnswered(formData: FormData): Promise<ActionResult> {
  const id = formId(formData);
  if (!id) return FAILED;
  const answered = formData.get("answered") === "true";
  const { supabase, user } = await requireUser("/intentions");

  const { data, error } = await supabase
    .from("intentions")
    .update({ is_answered: answered, answered_at: answered ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");
  if (error || !data?.length) return FAILED;

  revalidatePath("/intentions");
  return OK;
}

export async function deleteIntention(formData: FormData): Promise<ActionResult> {
  const id = formId(formData);
  if (!id) return FAILED;
  const { supabase, user } = await requireUser("/intentions");
  const { error } = await supabase.from("intentions").delete().eq("id", id).eq("user_id", user.id);
  if (error) return FAILED;

  revalidatePath("/intentions");
  return OK;
}
