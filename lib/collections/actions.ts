"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FAILED, OK, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth/require-user";
import { flash } from "@/lib/toast-flash";
import { formId } from "@/lib/validation";
import { collectionSchema } from "./schema";

export type CollectionFormState = { status: "idle" | "error"; message?: string };

const SAVE_ERROR = "We couldn't save that. Please try again.";
const DELETE_ERROR = "We couldn't delete that collection. Please try again.";

function parseForm(formData: FormData) {
  return collectionSchema.safeParse({ name: String(formData.get("name") ?? "") });
}

export async function createCollection(_prev: CollectionFormState, formData: FormData): Promise<CollectionFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { supabase, user } = await requireUser("/collections/new");
  const { data, error } = await supabase
    .from("collections")
    .insert({ user_id: user.id, name: parsed.data.name })
    .select("id")
    .single();
  if (error || !data) return { status: "error", message: SAVE_ERROR };

  revalidatePath("/collections", "layout");
  await flash("Collection created");
  redirect(`/collections/${data.id}`);
}

export async function updateCollection(_prev: CollectionFormState, formData: FormData): Promise<CollectionFormState> {
  const id = formId(formData);
  if (!id) return { status: "error", message: SAVE_ERROR };
  const parsed = parseForm(formData);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { supabase, user } = await requireUser(`/collections/${id}/edit`);
  const { data, error } = await supabase
    .from("collections")
    .update({ name: parsed.data.name })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");
  if (error || !data?.length) return { status: "error", message: SAVE_ERROR };

  revalidatePath("/collections", "layout");
  await flash("Collection saved");
  redirect(`/collections/${id}`);
}

export async function deleteCollection(formData: FormData) {
  const id = formId(formData);
  if (!id) {
    await flash(DELETE_ERROR, "error");
    redirect("/collections");
  }
  const { supabase, user } = await requireUser("/collections");
  const { error } = await supabase.from("collections").delete().eq("id", id).eq("user_id", user.id);
  if (error) {
    await flash(DELETE_ERROR, "error");
    redirect(`/collections/${id}`);
  }

  revalidatePath("/collections", "layout");
  await flash("Collection deleted");
  redirect("/collections");
}

/** Adds or removes one prayer from one of the user's collections. RLS checks ownership of both. */
export async function setCollectionMembership(formData: FormData): Promise<ActionResult> {
  const collectionId = formId(formData, "collectionId");
  const prayerId = formId(formData, "prayerId");
  if (!collectionId || !prayerId) return FAILED;
  const member = formData.get("member") === "true";
  const { supabase } = await requireUser("/collections");

  const { error } = member
    ? await supabase
        .from("collection_prayers")
        .upsert({ collection_id: collectionId, prayer_id: prayerId }, { ignoreDuplicates: true })
    : await supabase.from("collection_prayers").delete().eq("collection_id", collectionId).eq("prayer_id", prayerId);
  if (error) return FAILED;

  revalidatePath("/collections", "layout");
  revalidatePath("/prayers", "layout");
  return OK;
}
