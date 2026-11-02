"use client";

import { SectionError } from "@/components/layout/section-error";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <SectionError reset={reset} subject="your prayers" backHref="/" backLabel="Back home" />;
}
