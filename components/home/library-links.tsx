"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useOnline } from "@/lib/use-online";

const SECTIONS = [
  {
    href: "/prayers",
    title: "Your prayers",
    body: "Keep the prayers you love, organised into collections.",
    signedOutBody: "Sign in to keep the prayers you love, organised into collections.",
  },
  {
    href: "/intentions",
    title: "Intentions",
    body: "Hold the people and needs you are praying for.",
    signedOutBody: "Sign in to hold the people and needs you are praying for.",
  },
];

const OFFLINE_BODY = "You’re offline. This opens if you have visited it before.";

/** Links into the signed-in library; the line under each title says what to expect before the tap. */
export function LibraryLinks({ signedIn }: { signedIn: boolean }) {
  const online = useOnline();

  return (
    <ul className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      {SECTIONS.map(({ href, title, body, signedOutBody }) => (
        <li key={href} className="flex">
          <Link
            href={href}
            className="ora-press group flex min-h-32 w-full flex-col justify-between gap-6 rounded-3xl bg-card p-6 lg:min-h-48 lg:p-8"
          >
            <span className="flex items-start justify-between gap-4">
              <span className="font-display text-3xl leading-none lg:text-4xl">{title}</span>
              <ArrowRight
                className="size-6 shrink-0 text-primary transition-transform duration-200 ease-ora group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
            <span className="block max-w-xs text-base text-muted-foreground">
              {!online ? OFFLINE_BODY : signedIn ? body : signedOutBody}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
