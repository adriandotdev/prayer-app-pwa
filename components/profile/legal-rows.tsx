import { ChevronRight, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

const ROWS = [
  { href: "/privacy", label: "Privacy policy", hint: "What Ora keeps and how to control it", Icon: ShieldCheck },
  { href: "/terms", label: "Terms of service", hint: "The terms for using Ora", Icon: FileText },
] as const;

export function LegalRows() {
  return (
    <div className="flex flex-col gap-4">
      {ROWS.map(({ href, label, hint, Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex min-h-14 items-center gap-3 rounded-3xl bg-card px-5 py-3 transition-colors duration-200 hover:bg-secondary active:bg-accent"
        >
          <Icon className="size-5 text-gold" aria-hidden />
          <span className="flex-1">
            <span className="block font-medium">{label}</span>
            <span className="block text-sm text-muted-foreground">{hint}</span>
          </span>
          <ChevronRight className="size-5 text-muted-foreground" aria-hidden />
        </Link>
      ))}
    </div>
  );
}
