"use client";

import { NAV_ITEMS, isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Main"
			className="ora-chrome fixed inset-x-0 bottom-0 z-40 h-(--bottom-nav-height) bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-accent"
			>
				<svg
					className="h-full w-full text-card"
					viewBox="0 0 430 80"
					preserveAspectRatio="none"
				>
					<path
						d="M0 80 L8 28 Q13 0 43 0 H387 Q417 0 422 28 L430 80 Z"
						fill="currentColor"
						stroke="var(--border)"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
			</div>
			<ul className="relative mx-auto grid h-20 max-w-lg grid-cols-5">
				{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
					const active = isActive(pathname, href);
					const rosary = href === "/rosary";
					return (
						<li key={href} className="min-w-0">
							<Link
								href={href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"relative flex h-20 w-full touch-manipulation flex-col items-center justify-center gap-1.5 rounded-md px-0.5 pb-0 font-sans text-[13px] leading-none whitespace-nowrap [-webkit-tap-highlight-color:transparent] transition-transform duration-200 ease-out active:scale-[0.97] active:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset motion-reduce:transition-none",
									active
										? "font-semibold text-primary"
										: "font-medium text-muted-foreground",
								)}
							>
								<span
									aria-hidden="true"
									className={cn(
										"absolute top-1.5 h-0.5 w-5 rounded-full bg-gold ring-1 ring-foreground transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
										active ? "scale-x-100 opacity-100" : "scale-x-50 opacity-0",
									)}
								/>
								<span
									className={cn(
										"flex size-9 items-center justify-center rounded-md transition-transform duration-200 ease-out motion-reduce:transition-none",
										active && "-translate-y-0.5",
										rosary && "bg-gold/10",
									)}
								>
									<Icon
										className="size-6"
										strokeWidth={active ? 2.3 : 1.9}
										aria-hidden="true"
									/>
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
