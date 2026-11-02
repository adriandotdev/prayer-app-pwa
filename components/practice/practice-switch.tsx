import Link from "next/link";

import { cn } from "@/lib/utils";

const PRACTICES = [
  { id: "rosary", label: "Rosary", href: "/rosary" },
  { id: "divine-mercy", label: "Divine Mercy", href: "/divine-mercy" },
  { id: "angelus", label: "Angelus", href: "/angelus" },
] as const;

export type PracticeId = (typeof PRACTICES)[number]["id"];

/** The practices a person can switch between. Plain links, so each practice keeps its own URL and works offline. */
export function PracticeSwitch({ current }: { current: PracticeId }) {
  return (
    <nav aria-label="Prayer" className="flex w-full gap-1 rounded-full bg-secondary p-1 sm:w-fit">
      {PRACTICES.map((p) => {
        const on = p.id === current;
        return (
          <Link
            key={p.id}
            href={p.href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-1 items-center justify-center rounded-full px-5 text-[0.95rem] font-medium transition-colors duration-200 ease-ora sm:flex-none sm:px-6",
              on ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-card",
            )}
          >
            {p.label}
          </Link>
        );
      })}
    </nav>
  );
}
