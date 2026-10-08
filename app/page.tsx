import { ArrowRight, BookOpen, Cross, HandHeart } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PageHeader } from "@/components/layout/page-header";

const SECTIONS = [
  {
    href: "/rosary",
    title: "Pray the Rosary",
    body: "A guided, visual Rosary. No account needed, and it works offline.",
    icon: Cross,
  },
  {
    href: "/prayers",
    title: "Your prayers",
    body: "Keep the prayers you love, organised into collections.",
    icon: BookOpen,
  },
  {
    href: "/intentions",
    title: "Intentions",
    body: "Hold the people and needs you are praying for.",
    icon: HandHeart,
  },
];

export default function HomePage() {
  return (
    <>
      <PageHeader title="Peace be with you" description="Take a moment. What would you like to pray?" />
      <ul className="grid grid-cols-1 gap-4">
        {SECTIONS.map(({ href, title, body, icon: Icon }, i) => (
          <li key={href} className="ora-stagger" style={{ "--i": i } as CSSProperties}>
            <Link
              href={href}
              className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-gold/60 active:bg-secondary/50"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-gold-foreground dark:text-gold">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block font-display text-2xl leading-tight">{title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
              </span>
              <ArrowRight
                className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
