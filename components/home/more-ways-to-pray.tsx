import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PRACTICES = [
  { href: "/rosary", title: "The Rosary", body: "Five decades on the mysteries of Jesus and Mary.", time: "15–20 min" },
  { href: "/divine-mercy", title: "Divine Mercy Chaplet", body: "Ask for mercy on the whole world.", time: "10 min" },
  { href: "/angelus", title: "The Angelus", body: "Remember the Incarnation, morning, noon and evening.", time: "2 min" },
  { href: "/seven-sorrows", title: "Seven Sorrows", body: "Keep company with Mary through seven sorrows.", time: "20 min" },
  { href: "/stations-of-the-cross", title: "Stations of the Cross", body: "Walk the road of the cross with Jesus.", time: "30 min" },
] as const;

/** Every guided practice in one place, so none of them is reachable only through the tab row on another practice. */
export function MoreWaysToPray() {
  return (
    <section aria-labelledby="more-ways-title" className="rounded-3xl bg-card p-6 lg:p-8">
      <h2 id="more-ways-title" className="font-heading text-3xl leading-none lg:text-4xl">
        More ways to pray
      </h2>
      <ul className="mt-5 divide-y divide-border">
        {PRACTICES.map(({ href, title, body, time }) => (
          <li key={href}>
            <Link href={href} className="ora-row group -mx-3 grid min-h-16 grid-cols-[1fr_auto] items-center gap-x-4 rounded-2xl px-3 py-3 sm:grid-cols-[1fr_5rem_auto]">
              <span className="min-w-0">
                <span className="block text-lg font-medium">{title}</span>
                <span className="block text-base text-muted-foreground">
                  {body} <span className="whitespace-nowrap sm:hidden">· {time}</span>
                </span>
              </span>
              <span className="hidden text-right text-base text-muted-foreground tabular-nums sm:block">{time}</span>
              <ArrowRight
                className="size-5 shrink-0 text-primary transition-transform duration-200 ease-ora group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
