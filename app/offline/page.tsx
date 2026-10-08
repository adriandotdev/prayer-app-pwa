import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { AppButton } from "@/components/app-button";
import { EmptyState } from "@/components/layout/empty-state";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-stretch gap-4 sm:items-center">
      <EmptyState
        icon={WifiOff}
        title="You are offline"
        description="This page isn't saved on your device yet. The Rosary and any prayers you've opened still work."
      />
      <AppButton href="/rosary" variant="outline" className="w-full sm:w-auto">
        Open the Rosary
      </AppButton>
    </div>
  );
}
