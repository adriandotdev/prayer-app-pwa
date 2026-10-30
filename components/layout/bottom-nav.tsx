"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_ORA } from "@/lib/motion";
import { NAV_ITEMS, isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
	const pathname = usePathname();
	const reduceMotion = useReducedMotion();

	// The intention form has its own Save bar above the keyboard, and writing is a focus zone.
	if (/^\/intentions\/(new|[^/]+\/edit)$/.test(pathname)) return null;

	return (
		<nav
			aria-label="Main"
			className="ora-chrome fixed inset-x-0 bottom-0 z-40 h-(--bottom-nav-height) rounded-t-3xl bg-sidebar pb-[env(safe-area-inset-bottom)] md:hidden"
		>
			<ul className="mx-auto grid h-20 max-w-lg grid-cols-5 px-1">
				{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
					const active = isActive(pathname, href);
					return (
						<li key={href} className="min-w-0">
							<Link
								href={href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"relative flex h-20 w-full touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl px-0.5 font-sans text-[13px] leading-none whitespace-nowrap [-webkit-tap-highlight-color:transparent] transition-[transform,color] duration-200 ease-ora active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset motion-reduce:transition-none",
									active ? "font-semibold text-primary" : "font-medium text-muted-foreground",
								)}
							>
								<span className="relative flex h-9 w-14 items-center justify-center">
									{active && (
										// The pill glides to the tapped tab, like a bead moved along the string.
										<motion.span
											layoutId="bottom-nav-pill"
											aria-hidden="true"
											transition={{ duration: reduceMotion ? 0 : 0.32, ease: EASE_ORA }}
											className="absolute inset-0 rounded-full bg-accent"
										/>
									)}
									<Icon className="relative size-6" strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
								</span>
								<span>{label}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
