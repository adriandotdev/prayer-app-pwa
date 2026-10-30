"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { usePathname } from "next/navigation";
import { SidebarUser } from "./sidebar-user";
import { AppearanceLink } from "@/components/theme/appearance-link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { EASE_ORA } from "@/lib/motion";
import { NAV_ITEMS, isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <aside className="ora-chrome fixed inset-y-0 left-[max(0px,calc((100%_-_90rem)_/_2))] hidden w-60 flex-col lg:w-72 bg-sidebar md:flex">
      <div className="px-6 pt-8 pb-8 lg:px-8 lg:pt-10">
        <Link href="/" aria-label="Ora home" className="text-2xl">
          <Logo />
        </Link>
        <p className="mt-1.5 text-sm text-muted-foreground">A quiet place to pray</p>
      </div>

      <nav aria-label="Main" className="flex-1 px-3 lg:px-5">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-full px-4 py-3 text-[0.95rem] font-medium transition-colors duration-200 lg:text-base",
                    active
                      ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  {active && (
                    // Slides to the new item on navigation.
                    <motion.span
                      layoutId="sidebar-marker"
                      aria-hidden
                      transition={{ duration: reduceMotion ? 0 : 0.24, ease: EASE_ORA }}
                      className="absolute top-1/2 left-1.5 size-1.5 -translate-y-1/2 rounded-full bg-gold"
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

      <div className="flex items-center gap-2 px-3 py-3">
        <SidebarUser pathname={pathname} />
        <AppearanceLink />
        <ThemeToggle />
      </div>
    </aside>
  );
}
