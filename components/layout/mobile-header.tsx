import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
      <Link href="/" className="font-display text-xl font-medium tracking-tight">
        <span className="text-gold" aria-hidden>
          ✝{" "}
        </span>
        Ora
      </Link>
      <ThemeToggle />
    </header>
  );
}
