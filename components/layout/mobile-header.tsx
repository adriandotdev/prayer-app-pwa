import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-[calc(3.5rem+env(safe-area-inset-top))] items-center pt-[env(safe-area-inset-top)] justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
      <Link href="/" aria-label="Ora home" className="text-xl">
        <Logo />
      </Link>
      <ThemeToggle />
    </header>
  );
}
