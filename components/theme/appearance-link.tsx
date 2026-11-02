import { Palette } from "lucide-react";

import { AppButton } from "@/components/app-button";

/** Icon link to the Appearance screen, shown beside the light/dark toggle. */
export function AppearanceLink() {
  return (
    <AppButton href="/appearance" variant="ghost" size="icon" aria-label="Appearance">
      <Palette aria-hidden />
    </AppButton>
  );
}
