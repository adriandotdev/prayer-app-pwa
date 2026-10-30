import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { TodayDecades } from "@/components/home/today-decades";
import { TodayHero } from "@/components/home/today-hero";

const SECTIONS = [
  {
    href: "/prayers",
    title: "Your prayers",
    body: "Keep the prayers you love, organised into collections.",
  },
  {
    href: "/intentions",
    title: "Intentions",
    body: "Hold the people and needs you are praying for.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 lg:max-w-none lg:grid-cols-[22rem_1fr] lg:gap-8">
      <div className="ora-stagger contents">
        <div className="lg:h-full" style={{ ["--i" as string]: 0 }}>
          <TodayHero />
        </div>
        <div className="flex flex-col gap-4 lg:gap-8" style={{ ["--i" as string]: 1 }}>
          <TodayDecades />
          <ul className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            {SECTIONS.map(({ href, title, body }) => (
              <li key={href} className="flex">
                <Link
                  href={href}
                  className="ora-press group flex min-h-32 w-full flex-col justify-between gap-6 rounded-3xl bg-card p-6 lg:min-h-48 lg:p-8"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="font-display text-3xl leading-none lg:text-4xl">{title}</span>
                    <ArrowUpRight
                      className="size-6 shrink-0 text-primary transition-transform duration-200 ease-ora group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                  <span className="block max-w-xs text-base text-muted-foreground">{body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
