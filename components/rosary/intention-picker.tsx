"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Check, ChevronDown, Plus, Search } from "lucide-react";

import {
  listActiveIntentionsForPicker,
  type PickerIntention,
} from "@/lib/intentions/actions";
import { cn } from "@/lib/utils";

// Per-device convenience: the last intention chosen, so a regular prayer needs no re-picking.
// A stored id also tells the next visit that a picker is coming, so its space is reserved while loading.
const LAST_KEY = "ora:rosary-intention:v1";

function readLast(): string | null {
  try {
    return localStorage.getItem(LAST_KEY);
  } catch {
    return null;
  }
}

function writeLast(id: string | null) {
  try {
    localStorage.setItem(LAST_KEY, id ?? "");
  } catch {
    /* private mode or blocked storage: the choice just isn't remembered */
  }
}

const noopSubscribe = () => () => {};

// The list never grows past this many intentions; search reaches the rest.
const MAX_SHOWN = 5;

const NONE = "No one in particular";

/**
 * Optional "Praying for" choice. Renders nothing when signed out or offline. With no active intentions it
 * offers a quiet link to add one. The current choice is always shown in full; the list opens inline.
 */
export function IntentionPicker({
  value,
  onChange,
  className,
}: {
  value: string | null;
  onChange: (id: string | null, text: string | null) => void;
  className?: string;
}) {
  const [items, setItems] = useState<PickerIntention[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const hadLast = useSyncExternalStore(
    noopSubscribe,
    () => !!readLast(),
    () => false,
  );
  const listId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    let live = true;
    listActiveIntentionsForPicker()
      .then((list) => {
        if (!live) return;
        setItems(list);
        const last = readLast();
        const match = list?.find((i) => i.id === last);
        if (match) onChangeRef.current(match.id, match.text);
        else if (last) writeLast(null);
      })
      .catch(() => {
        /* offline or unreachable: the Rosary works without it */
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  if (loading) {
    // Hold the space for returning users so the page doesn't jump when the picker arrives.
    return hadLast ? (
      <div
        aria-hidden
        className={cn("h-[4.75rem] rounded-2xl bg-card/60", className)}
      />
    ) : null;
  }
  if (items === null) return null;

  if (items.length === 0) {
    return (
      <div className={cn("ora-enter", className)}>
        <Link
          href="/intentions/new"
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl px-1 text-base text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Plus className="size-4" aria-hidden />
          Add an intention to pray for
        </Link>
      </div>
    );
  }

  const current = items.find((i) => i.id === value) ?? null;
  const searchable = items.length > MAX_SHOWN;
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? items.filter((i) => i.text.toLowerCase().includes(needle))
    : items;
  const shown = matches.slice(0, MAX_SHOWN);
  const hidden = matches.length - shown.length;

  const choose = (id: string | null) => {
    const picked = items.find((i) => i.id === id) ?? null;
    writeLast(picked?.id ?? null);
    onChange(picked?.id ?? null, picked?.text ?? null);
    setOpen(false);
    setQuery("");
    trigger.current?.focus();
  };

  return (
    <div
      className={cn("ora-enter", className)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          setQuery("");
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[4.75rem] w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-muted-foreground">
            Praying for
          </span>
          <span
            className={cn(
              "mt-0.5 line-clamp-2 block text-base",
              current ? "font-medium" : "text-foreground/80",
            )}
          >
            {current ? current.text : NONE}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
          {current ? "Change" : "Choose"}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300 ease-ora",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </span>
      </button>

      {open && (
        <div
          id={listId}
          className="mt-2 rounded-2xl border border-border bg-card p-1"
        >
          {searchable && (
            <div className="p-2 pb-1">
              <label htmlFor={`${listId}-search`} className="sr-only">
                Search your intentions
              </label>
              <div className="relative">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id={`${listId}-search`}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your intentions"
                  autoComplete="off"
                  className="h-12 w-full rounded-xl bg-secondary pr-3 pl-10 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring"
                />
              </div>
            </div>
          )}
          <div
            role="radiogroup"
            aria-label="Praying for"
            className="flex flex-col"
          >
            {[{ id: "", text: NONE }, ...shown].map((i) => {
              const on = (value ?? "") === i.id;
              return (
                <label
                  key={i.id || "none"}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-base leading-snug hover:bg-secondary has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring"
                >
                  <input
                    type="radio"
                    name={listId}
                    checked={on}
                    onChange={() => choose(i.id || null)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full",
                      on
                        ? "bg-primary text-primary-foreground"
                        : "border border-border",
                    )}
                  >
                    {on && <Check className="size-3" strokeWidth={2.6} />}
                  </span>
                  <span
                    className={cn(
                      "line-clamp-2 min-w-0 flex-1 wrap-anywhere",
                      !i.id && "text-foreground/80",
                    )}
                  >
                    {i.text}
                  </span>
                </label>
              );
            })}
          </div>
          {needle && matches.length === 0 && (
            <p className="px-3 py-3 text-base text-muted-foreground">
              No intention matches “{query.trim()}”.
            </p>
          )}
          {hidden > 0 && (
            <p className="px-3 pt-1 pb-2.5 text-sm text-muted-foreground">
              {needle
                ? `${hidden} more match${hidden === 1 ? "" : "es"}. Keep typing to narrow them.`
                : `${hidden} more. Search to find them.`}
            </p>
          )}
          <span role="status" className="sr-only">
            {needle
              ? `${matches.length} intention${matches.length === 1 ? "" : "s"} found`
              : ""}
          </span>
        </div>
      )}
    </div>
  );
}
