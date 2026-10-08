"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { usePathname } from "next/navigation";
import { SidebarUser } from "./sidebar-user";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { EASE_ORA } from "@/lib/motion";
import { NAV_ITEMS, isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="px-6 pt-8 pb-6">
        <Link href="/" aria-label="Ora home" className="text-2xl">
          <Logo />
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">A quiet place to pray</p>
      </div>

      <nav aria-label="Main" className="flex-1 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  {active && (
                    // Slides to the new item on navigation.
                    <motion.span
                      layoutId="sidebar-marker"
                      aria-hidden
                      transition={{ duration: reduceMotion ? 0 : 0.24, ease: EASE_ORA }}
                      className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold"
                    />
                  )}
                  <Icon className={cn("size-5", active && "text-gold")} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-2 border-t border-sidebar-border px-3 py-3">
        <SidebarUser pathname={pathname} />
        <ThemeToggle />
      </div>
    </aside>
  );
}
