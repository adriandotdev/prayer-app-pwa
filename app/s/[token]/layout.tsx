import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/** The app's navigation is hidden on shared links, so the wordmark and theme toggle live here for visitors without an account. */
export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link href="/" aria-label="Ora home" className="-mx-2 rounded-full px-2 py-2 text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <Logo />
        </Link>
        <ThemeToggle />
      </div>
      {children}
    </>
  );
}
