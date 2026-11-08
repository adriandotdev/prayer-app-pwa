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

	// The intention and prayer forms have their own Save bar above the keyboard, and writing is a focus zone.
	if (/^\/(intentions|prayers)\/(new|[^/]+\/edit)$/.test(pathname)) return null;

	return (
		<nav
			aria-label="Main"
			className="ora-chrome fixed inset-x-0 bottom-0 z-40 h-(--bottom-nav-height) rounded-t-[1.75rem] border-t border-sidebar-border/70 bg-sidebar pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_32px_-16px_oklch(0.26_0.05_258/0.28)] md:hidden"
		>
			<ul className="mx-auto grid h-20 max-w-lg grid-cols-5 px-2">
				{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
					const active = isActive(pathname, href);
					return (
						<li key={href} className="min-w-0">
							<Link
								href={href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"relative flex h-20 w-full touch-manipulation flex-col items-center justify-center gap-1.5 rounded-2xl px-0.5 font-sans text-[13px] leading-none tracking-[0.01em] whitespace-nowrap [-webkit-tap-highlight-color:transparent] transition-[transform,color] duration-200 ease-ora active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset motion-reduce:transition-none",
									active ? "font-semibold text-primary" : "font-medium text-muted-foreground",
								)}
							>
								<span className="relative flex h-8 w-16 items-center justify-center">
									{active && (
										// A soft pill behind the icon, gliding to the tapped tab like a bead along the string.
										<motion.span
											layoutId="bottom-nav-indicator"
											aria-hidden="true"
											transition={{ duration: reduceMotion ? 0 : 0.32, ease: EASE_ORA }}
											className="absolute inset-0 rounded-full bg-primary/15"
										/>
									)}
									<Icon
										className={cn("relative size-[22px] transition-transform duration-300 ease-ora motion-reduce:transition-none", active && "scale-110")}
										strokeWidth={active ? 2 : 1.6}
										fill={active ? "currentColor" : "none"}
										fillOpacity={active ? 0.14 : 0}
										aria-hidden="true"
									/>
								</span>
								<span>{label}</span>
								{active && (
									// A tiny gold ember under the label travels with the pill.
									<motion.span
										layoutId="bottom-nav-ember"
										aria-hidden="true"
										transition={{ duration: reduceMotion ? 0 : 0.32, ease: EASE_ORA }}
										className="absolute bottom-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-gold"
									/>
								)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
