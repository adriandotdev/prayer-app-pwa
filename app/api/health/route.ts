import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Temporary connectivity check: reads the public starter prayers. Remove before launch.
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prayers")
    .select("id, title")
    .is("user_id", null)
    .order("title");

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, count: data.length, prayers: data });
}
