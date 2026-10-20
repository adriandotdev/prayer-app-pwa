import { ChevronRight, Palette } from "lucide-react";
import Link from "next/link";

export function AppearanceRow() {
  return (
    <Link
      href="/appearance"
      className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors active:bg-accent"
    >
      <Palette className="size-5 text-gold" aria-hidden />
      <span className="flex-1">
        <span className="block font-medium">Appearance</span>
        <span className="block text-sm text-muted-foreground">Light or dark, and liturgical season colors</span>
      </span>
      <ChevronRight className="size-5 text-muted-foreground" aria-hidden />
    </Link>
  );
}
