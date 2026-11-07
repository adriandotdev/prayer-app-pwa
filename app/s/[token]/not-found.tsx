import { AppButton } from "@/components/app-button";

export default function SharedNotFound() {
  return (
    <div data-shared-view className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-4xl leading-tight font-medium tracking-[-0.02em] md:text-5xl">This link isn’t available</h1>
      <p className="mt-4 text-base text-muted-foreground">
        It may have been typed wrongly, or the person who shared it has stopped sharing.
      </p>
      <AppButton href="/" className="mt-8">
        Go to Ora
      </AppButton>
    </div>
  );
}
