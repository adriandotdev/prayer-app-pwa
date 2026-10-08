"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

/** Formats in the viewer's timezone. Renders empty on the server so hydration never mismatches. */
export function LocalDate({ iso, prefix }: { iso: string; prefix?: string }) {
  const text = useSyncExternalStore(
    noop,
    () => FORMAT.format(new Date(iso)),
    () => "",
  );
  return (
    <time dateTime={iso}>
      {text ? prefix : null}
      {text}
    </time>
  );
}
