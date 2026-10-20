"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { SEASON_BACKGROUNDS } from "@/lib/theme/season";
import { useSeason } from "@/lib/theme/use-season";

/**
 * Keeps <html data-season> and <meta name="theme-color"> in step with the saved choice. The head
 * script has already set the attribute before first paint; this handles changes after that.
 */
export function SeasonSync() {
  const { resolved } = useSeason();
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (resolved) root.setAttribute("data-season", resolved);
    else root.removeAttribute("data-season");
  }, [resolved]);

  // The pathname dependency re-applies this after a navigation re-renders the metadata tags.
  useEffect(() => {
    const mode = resolvedTheme === "dark" ? "dark" : "light";
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      meta.dataset.oraOriginal ??= meta.content;
      meta.content = resolved ? SEASON_BACKGROUNDS[resolved][mode] : meta.dataset.oraOriginal;
    });
  }, [resolved, resolvedTheme, pathname]);

  return null;
}
