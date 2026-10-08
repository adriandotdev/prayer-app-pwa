"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";

import { getSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Person = { name: string; email: string | null };

/**
 * The signed-in user, or a sign-in link. Loaded in the browser on purpose: reading the user
 * on the server would make every page (including the public Rosary) dynamic and would put a
 * name into the HTML the service worker caches for offline use.
 */
export function SidebarUser({ pathname }: { pathname: string }) {
  const [person, setPerson] = useState<Person | null | undefined>(undefined);

  // Re-read on navigation so a name saved on /profile shows up straight away.
  useEffect(() => {
    if (!getSupabaseEnv()) return;
    const supabase = createClient();
    let cancelled = false;

    async function load() {
      // getSession reads the stored session, so the name still shows while offline.
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) return !cancelled && setPerson(null);

      const fallback =
        (user.user_metadata?.full_name as string | undefined) ?? user.email?.split("@")[0] ?? "Signed in";
      if (!cancelled) setPerson({ name: fallback, email: user.email ?? null });

      const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
      if (!cancelled && profile?.display_name) setPerson({ name: profile.display_name, email: user.email ?? null });
    }
    void load().catch(() => {});

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setPerson(null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [pathname]);

  if (person === undefined) return <div className="h-11 flex-1" aria-hidden />;

  if (person === null) {
    return (
      <Link
        href="/login"
        className="flex min-h-11 flex-1 items-center gap-3 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      >
        <LogIn className="size-5" aria-hidden />
        Sign in
      </Link>
    );
  }

  const active = pathname === "/profile" || pathname.startsWith("/profile/");
  return (
    <Link
      href="/profile"
      aria-label={`Profile: ${person.name}`}
      className={cn(
        "flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg px-2 transition-colors",
        active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60",
      )}
    >
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold/25 text-sm font-medium text-sidebar-foreground"
      >
        {person.name.trim().charAt(0).toUpperCase() || "?"}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-sidebar-foreground">{person.name}</span>
        {person.email && person.email !== person.name && (
          <span className="block truncate text-xs text-muted-foreground">{person.email}</span>
        )}
      </span>
    </Link>
  );
}
