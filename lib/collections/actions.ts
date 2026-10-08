"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";
import { flash } from "@/lib/toast-flash";
import { collectionSchema } from "./schema";

export type CollectionFormState = { status: "idle" | "error"; message?: string };

const SAVE_ERROR = "We couldn't save that. Please try again.";

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
  const id = String(formData.get("id") ?? "");
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
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await requireUser("/collections");
  await supabase.from("collections").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/collections", "layout");
  await flash("Collection deleted");
  redirect("/collections");
}

/** Adds or removes one prayer from one of the user's collections. RLS checks ownership of both. */
export async function setCollectionMembership(formData: FormData) {
  const collectionId = String(formData.get("collectionId") ?? "");
  const prayerId = String(formData.get("prayerId") ?? "");
  const member = formData.get("member") === "true";
  const { supabase } = await requireUser("/collections");

  if (member) {
    await supabase
      .from("collection_prayers")
      .upsert({ collection_id: collectionId, prayer_id: prayerId }, { ignoreDuplicates: true });
  } else {
    await supabase.from("collection_prayers").delete().eq("collection_id", collectionId).eq("prayer_id", prayerId);
  }

  revalidatePath("/collections", "layout");
  revalidatePath("/prayers", "layout");
}
