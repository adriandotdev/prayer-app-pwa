"use client";

import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { StatePage } from "@/components/layout/state-page";

type Props = {
  reset: () => void;
  /** What failed, e.g. "your prayers", so the message says where the problem is. */
  subject: string;
  backHref: string;
  backLabel: string;
};

/** Error boundary body for one section: retry in place, or step back to somewhere that works. */
export function SectionError({ reset, subject, backHref, backLabel }: Props) {
  return (
    <div role="alert">
      <StatePage
        icon={RotateCcw}
        title="Something went wrong"
        description={`We couldn’t load ${subject}. Please try again. If it keeps happening, come back in a little while.`}
      >
        <AppButton size="lg" onClick={reset}>
          Try again
        </AppButton>
        <AppButton size="lg" variant="outline" href={backHref}>
          {backLabel}
        </AppButton>
      </StatePage>
    </div>
  );
}
