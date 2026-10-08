"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
