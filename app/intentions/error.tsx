"use client";

import { SectionError } from "@/components/layout/section-error";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <SectionError reset={reset} subject="your intentions" backHref="/" backLabel="Back home" />;
}
