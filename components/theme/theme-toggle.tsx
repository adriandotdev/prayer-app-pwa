"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { AppButton } from "@/components/app-button";

/**
 * One tap flips light/dark. Until it is tapped the theme follows the system preference,
 * so the first visit already matches the device.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // The whole page cross-fades between themes (View Transitions). Browsers without it, and
  // visitors who prefer reduced motion, just get the instant switch.
  const switchTheme = (next: string) => {
    const doc = document as Document & { startViewTransition?: (update: () => void) => unknown };
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(next);
      return;
    }
    doc.startViewTransition(() => flushSync(() => setTheme(next)));
  };

  return (
    <AppButton
      variant="ghost"
      size="icon"
      aria-label="Switch between light and dark theme"
      onClick={() => switchTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Both icons are always rendered; CSS picks one, so there is no hydration mismatch. */}
      <Sun className="ora-fade size-5 dark:hidden" aria-hidden />
      <Moon className="ora-fade hidden size-5 dark:block" aria-hidden />
    </AppButton>
  );
}
