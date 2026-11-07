"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { applySeasonAttribute, applyThemeColor } from "@/lib/theme/apply-season";
import { useSeason } from "@/lib/theme/use-season";

const subscribeNever = () => () => {};

/**
 * Keeps <html data-season> and <meta name="theme-color"> in step with the saved choice. The head
 * script has already set the attribute before first paint; this handles changes after that.
 * Shared links (/s/…) show the sharer's season instead, which `SharedSeason` applies, so this stands down there.
 */
export function SeasonSync() {
  const { resolved } = useSeason();
  // Hydration renders with the server's "default" choice before the saved one arrives. Writing then
  // would strip the attribute the head script set, so wait for the real value.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const onSharedPage = pathname.startsWith("/s/");

  useEffect(() => {
    if (!hydrated || onSharedPage) return;
    applySeasonAttribute(resolved);
  }, [hydrated, resolved, onSharedPage]);

  // The pathname dependency re-applies this after a navigation re-renders the metadata tags.
  useEffect(() => {
    if (!hydrated || onSharedPage) return;
    applyThemeColor(resolved, resolvedTheme === "dark" ? "dark" : "light");
  }, [hydrated, resolved, resolvedTheme, pathname, onSharedPage]);

  return null;
}
