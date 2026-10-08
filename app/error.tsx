"use client";

import { AppButton } from "@/components/app-button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="py-16 text-center">
      <h1 className="text-4xl">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
        Please try again. If it keeps happening, come back in a little while.
      </p>
      <AppButton className="mt-6" onClick={reset}>
        Try again
      </AppButton>
    </div>
  );
}
