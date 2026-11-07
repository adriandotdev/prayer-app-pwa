/** Kept apart from sync.ts so callers can signal without pulling the IndexedDB code into their bundle. */
export const LIBRARY_STALE_EVENT = "ora:library-stale";

/** Tell the sync component the server data changed (after a successful mutation) so it refreshes the copy. */
export function markLibraryStale() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(LIBRARY_STALE_EVENT));
}
