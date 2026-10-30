import type { Metadata } from "next";
import { WifiOff } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { StatePage } from "@/components/layout/state-page";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <StatePage
      icon={WifiOff}
      title="You are offline"
      description="This page isn’t saved on your device yet. The Rosary and any prayers you’ve opened still work."
    >
      <AppButton href="/rosary" size="lg">
        Open the Rosary
      </AppButton>
    </StatePage>
  );
}
