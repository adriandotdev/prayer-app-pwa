"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { signInWithEmail, signInWithGoogle, type LoginState } from "@/app/login/actions";

const initial: LoginState = { status: "idle" };

export function LoginForm({ next, error }: { next: string; error?: string }) {
  const [state, action, pending] = useActionState(signInWithEmail, initial);

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-gold/40 bg-card p-6 text-center">
        <Mail className="mx-auto size-8 text-gold" aria-hidden />
        <h2 className="mt-3 font-heading text-2xl">Check your email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a sign-in link to <span className="text-foreground">{state.email}</span>. Open it on this device to continue.
        </p>
      </div>
    );
  }

  const message =
    state.status === "error"
      ? state.message
      : error === "callback"
        ? "That sign-in link is invalid or expired. Please request a new one."
        : error === "oauth"
          ? "Google sign-in isn't available right now."
          : undefined;

  return (
    <div className="flex flex-col gap-5">
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <AppButton type="submit" variant="outline" size="lg" className="w-full">
          <GoogleMark /> Continue with Google
        </AppButton>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={next} />
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          placeholder="you@example.com"
          aria-invalid={state.status === "error"}
          aria-describedby={message ? "login-error" : undefined}
          className="min-h-14 rounded-xl border border-border bg-background px-4 text-base outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        {message && (
          <p id="login-error" role="alert" className="text-sm text-destructive">
            {message}
          </p>
        )}
        <AppButton type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Email me a sign-in link"}
        </AppButton>
      </form>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.6-2.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.6 2.8C6.6 7.4 9.1 5.4 12 5.4z" />
    </svg>
  );
}
