"use client";

import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { StatePage } from "@/components/layout/state-page";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert">
      <StatePage
        icon={RotateCcw}
        title="Something went wrong"
        description="Please try again. If it keeps happening, come back in a little while."
      >
        <AppButton size="lg" onClick={reset}>
          Try again
        </AppButton>
      </StatePage>
    </div>
  );
}
