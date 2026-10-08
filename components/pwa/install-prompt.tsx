"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, Share, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const DISMISS_KEY = "ora:install-dismissed";
const noop = () => () => {};

function useClientValue<T>(get: () => T, server: T) {
  return useSyncExternalStore(noop, get, () => server);
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const standalone = useClientValue(
    () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
    true,
  );
  const ios = useClientValue(() => /iPad|iPhone|iPod/.test(navigator.userAgent), false);
  const wasDismissed = useClientValue(() => {
    try {
      return window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  }, true);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (standalone || wasDismissed || dismissed || (!deferred && !ios)) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <section
      aria-label="Install Ora"
      className="mb-6 flex items-start gap-3 rounded-2xl border border-gold/40 bg-card p-4"
    >
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium">Install Ora</p>
        {deferred ? (
          <p className="mt-0.5 text-muted-foreground">Add it to your home screen to pray the Rosary even offline.</p>
        ) : (
          <p className="mt-0.5 text-muted-foreground">
            Tap <Share className="mx-0.5 inline size-3.5 align-text-bottom" aria-label="Share" /> in Safari, then{" "}
            <span className="text-foreground">Add to Home Screen</span>.
          </p>
        )}
        {deferred && (
          <Button
            size="sm"
            className="mt-3"
            onClick={async () => {
              await deferred.prompt();
              await deferred.userChoice;
              setDeferred(null);
            }}
          >
            <Download /> Install
          </Button>
        )}
      </div>
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="rounded p-1 text-muted-foreground hover:text-foreground">
        <X className="size-4" />
      </button>
    </section>
  );
}
