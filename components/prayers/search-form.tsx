"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { FIELD } from "@/components/field";
import type { PrayerFilter } from "@/lib/prayers/schema";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

/**
 * Filters as you type: the URL is updated shortly after typing pauses, so the server-rendered
 * list stays the single source of truth and the result is still a shareable link. The form
 * remains a plain GET form, so Enter (or no JavaScript) still works.
 */
export function SearchForm({
	filter,
	query,
}: {
	filter: PrayerFilter;
	query: string;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [value, setValue] = useState(query);
	const [pending, startTransition] = useTransition();
	// The last query this component put in the URL, to tell our own updates from outside ones.
	const pushed = useRef(query);

	// The list's own "clear search" button or a filter tab changed the URL: follow it.
	useEffect(() => {
		if (query !== pushed.current) {
			pushed.current = query;
			setValue(query);
		}
	}, [query]);

	useEffect(() => {
		const next = value.trim();
		if (next === pushed.current) return;
		const timer = setTimeout(() => {
			pushed.current = next;
			const params = new URLSearchParams();
			if (filter !== "all") params.set("filter", filter);
			if (next) params.set("q", next);
			const qs = params.toString();
			startTransition(() =>
				router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }),
			);
		}, DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [value, filter, pathname, router]);

	return (
		<form role="search" action="/prayers" className="mb-4">
			{filter !== "all" ? (
				<input type="hidden" name="filter" value={filter} />
			) : null}
			<input
				type="text"
				inputMode="search"
				name="q"
				value={value}
				onChange={(event) => setValue(event.target.value)}
				aria-label="Search prayers"
				aria-busy={pending}
				placeholder="Search prayers"
				enterKeyHint="search"
				autoComplete="off"
				maxLength={100}
				className={cn(FIELD, "min-h-12 w-full", pending && "opacity-80")}
			/>
		</form>
	);
}
