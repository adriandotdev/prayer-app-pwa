"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

import { applySeasonAttribute, applyThemeColor } from "@/lib/theme/apply-season";
import type { SeasonChoice } from "@/lib/theme/season";
import { useTodaySeason } from "@/lib/theme/use-season";

/**
 * Themes a shared link with the colours its sharer chose, whatever the visitor has saved. Light or
 * dark stays the visitor's own. Leaving the page hands control back to `SeasonSync`.
 */
export function SharedSeason({ choice }: { choice: SeasonChoice }) {
  const today = useTodaySeason();
  const { resolvedTheme } = useTheme();
  const resolved = choice === "default" ? null : choice === "auto" ? today : choice;

  useEffect(() => {
    applySeasonAttribute(resolved);
    applyThemeColor(resolved, resolvedTheme === "dark" ? "dark" : "light");
  }, [resolved, resolvedTheme]);

  return null;
}
