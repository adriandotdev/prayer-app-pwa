"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AppButton } from "@/components/app-button";

/**
 * One tap flips light/dark. Until it is tapped the theme follows the system preference,
 * so the first visit already matches the device.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <AppButton
      variant="ghost"
      size="icon"
      aria-label="Switch between light and dark theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Both icons are always rendered; CSS picks one, so there is no hydration mismatch. */}
      <Sun className="ora-fade size-5 dark:hidden" aria-hidden />
      <Moon className="ora-fade hidden size-5 dark:block" aria-hidden />
    </AppButton>
  );
}
