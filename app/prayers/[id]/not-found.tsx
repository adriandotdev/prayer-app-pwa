import { AppButton } from "@/components/app-button";

export default function PrayerNotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-4xl">Prayer not found</h1>
      <p className="mx-auto mt-3 max-w-sm text-muted-foreground">It may have been deleted, or it isn&apos;t yours to open.</p>
      <AppButton href="/prayers" className="mt-6">
        Back to prayers
      </AppButton>
    </div>
  );
}
