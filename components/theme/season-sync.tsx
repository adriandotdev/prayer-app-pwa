"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { SEASON_BACKGROUNDS } from "@/lib/theme/season";
import { useSeason } from "@/lib/theme/use-season";

const subscribeNever = () => () => {};

/**
 * Keeps <html data-season> and <meta name="theme-color"> in step with the saved choice. The head
 * script has already set the attribute before first paint; this handles changes after that.
 */
export function SeasonSync() {
  const { resolved } = useSeason();
  // Hydration renders with the server's "default" choice before the saved one arrives. Writing then
  // would strip the attribute the head script set, so wait for the real value.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (resolved) root.setAttribute("data-season", resolved);
    else root.removeAttribute("data-season");
  }, [hydrated, resolved]);

  // The pathname dependency re-applies this after a navigation re-renders the metadata tags.
  useEffect(() => {
    if (!hydrated) return;
    const mode = resolvedTheme === "dark" ? "dark" : "light";
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      meta.dataset.oraOriginal ??= meta.content;
      meta.content = resolved ? SEASON_BACKGROUNDS[resolved][mode] : meta.dataset.oraOriginal;
    });
  }, [hydrated, resolved, resolvedTheme, pathname]);

  return null;
}
