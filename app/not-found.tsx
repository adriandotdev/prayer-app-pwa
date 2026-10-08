import { AppButton } from "@/components/app-button";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-4xl">Page not found</h1>
      <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
        We couldn&apos;t find what you were looking for.
      </p>
      <AppButton href="/" className="mt-6">
        Return home
      </AppButton>
    </div>
  );
}
