import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/layout/empty-state";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <EmptyState
        icon={WifiOff}
        title="You are offline"
        description="This page isn't saved on your device yet. The Rosary and any prayers you've opened still work."
      />
      <Link href="/rosary" className="text-sm underline underline-offset-4">
        Open the Rosary
      </Link>
    </div>
  );
}
