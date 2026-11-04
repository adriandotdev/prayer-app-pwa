import Link from "next/link";

import { GoogleButton } from "@/components/auth/google-button";
import { signInWithGoogle } from "@/app/login/actions";

export function LoginForm({ next, error }: { next: string; error?: string }) {
  const message =
    error === "callback"
      ? "Sign-in didn't complete. Please try again."
      : error === "oauth"
        ? "Google sign-in isn't available right now."
        : undefined;

  return (
    <div className="flex flex-col gap-4">
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <GoogleButton />
      </form>
      <p className="text-sm text-muted-foreground">
        By continuing you agree to the{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms
        </Link>{" "}
        and acknowledge the{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        , including how Ora handles your prayer intentions and Rosary history.
      </p>
      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
    </div>
  );
}
