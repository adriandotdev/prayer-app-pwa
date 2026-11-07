import { STORES, clearAllStores, readOne, transact } from "./db";
import { LIBRARY_SCHEMA, type LibraryMeta, type LibrarySnapshot } from "./types";

export type SyncResult = "synced" | "signed-out" | "offline" | "error" | "unavailable";

/** Bumped on every wipe so a sync that was already in flight can't write a signed-out user's data back. */
let epoch = 0;
let inFlight: Promise<SyncResult> | null = null;

export async function getMeta(): Promise<LibraryMeta | undefined> {
  return readOne<LibraryMeta>("meta", "state");
}

/** Forgets the offline copy and the queued changes. Used on sign-out, account deletion and user change. */
export async function wipeLibrary(): Promise<void> {
  epoch += 1;
  if (typeof indexedDB === "undefined") return;
  try {
    await clearAllStores();
  } catch {
    /* nothing stored, or storage unavailable: nothing to forget */
  }
}

function newerThan(a: string | null, b: string | null) {
  if (!b) return false;
  if (!a) return true;
  return Date.parse(b) > Date.parse(a);
}

/**
 * Writes a snapshot into IndexedDB in a single transaction, so the copy is never half-updated.
 * Returns "needs-full" (and leaves the copy empty) if a delta arrives for a different user.
 */
export async function applySnapshot(snapshot: LibrarySnapshot): Promise<"applied" | "needs-full"> {
  let outcome: "applied" | "needs-full" = "applied";
  await transact(STORES, "readwrite", (tx) => {
    const metaRequest = tx.objectStore("meta").get("state");
    metaRequest.onsuccess = () => {
      const previous = metaRequest.result as LibraryMeta | undefined;
      const sameCopy = !!previous && previous.userId === snapshot.userId && previous.schema === LIBRARY_SCHEMA;

      if (!sameCopy) {
        // Another account's data (or an older layout) must not survive, queue included.
        for (const name of STORES) tx.objectStore(name).clear();
        if (!snapshot.full) {
          outcome = "needs-full";
          return;
        }
      }

      const prayers = tx.objectStore("prayers");
      const keep = new Set(snapshot.allPrayerIds);
      const keysRequest = prayers.getAllKeys();
      keysRequest.onsuccess = () => {
        // Drop prayers that no longer exist on the server (deleted, or another device removed them).
        for (const key of keysRequest.result) if (!keep.has(String(key))) prayers.delete(key);
      };
      for (const prayer of snapshot.prayers) prayers.put(prayer);

      for (const [name, rows] of [
        ["favorites", snapshot.favorites.map((prayer_id) => ({ prayer_id }))],
        ["collections", snapshot.collections],
        ["collectionPrayers", snapshot.collectionPrayers],
      ] as const) {
        const store = tx.objectStore(name);
        store.clear();
        for (const row of rows) store.put(row);
      }

      let maxUpdatedAt = sameCopy && !snapshot.full ? (previous?.maxUpdatedAt ?? null) : null;
      for (const prayer of snapshot.prayers) if (newerThan(maxUpdatedAt, prayer.updated_at)) maxUpdatedAt = prayer.updated_at;
      const meta: LibraryMeta = {
        key: "state",
        userId: snapshot.userId,
        schema: LIBRARY_SCHEMA,
        lastSyncAt: Date.now(),
        maxUpdatedAt,
      };
      tx.objectStore("meta").put(meta);
    };
  });
  return outcome;
}

function isSnapshot(value: unknown): value is LibrarySnapshot {
  const s = value as Partial<LibrarySnapshot> | null;
  return (
    !!s &&
    s.v === LIBRARY_SCHEMA &&
    typeof s.userId === "string" &&
    typeof s.full === "boolean" &&
    Array.isArray(s.prayers) &&
    Array.isArray(s.allPrayerIds) &&
    Array.isArray(s.favorites) &&
    Array.isArray(s.collections) &&
    Array.isArray(s.collectionPrayers)
  );
}

async function runSync(fetchImpl: typeof fetch): Promise<SyncResult> {
  const startedAt = epoch;
  let meta: LibraryMeta | undefined;
  try {
    meta = await getMeta();
  } catch {
    return "unavailable";
  }

  // Ask only for what changed, and only against the same user's copy at the same layout.
  const params = new URLSearchParams();
  if (meta && meta.schema === LIBRARY_SCHEMA && meta.maxUpdatedAt) {
    params.set("since", meta.maxUpdatedAt);
    params.set("uid", meta.userId);
    params.set("schema", String(LIBRARY_SCHEMA));
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let response: Response;
    try {
      response = await fetchImpl(`/api/library/snapshot${params.size ? `?${params}` : ""}`, {
        credentials: "same-origin",
        cache: "no-store",
      });
    } catch {
      return "offline";
    }

    if (response.status === 401) {
      await wipeLibrary();
      return "signed-out";
    }
    if (!response.ok) return "error";

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      return "error";
    }
    if (!isSnapshot(body)) return "error";
    if (startedAt !== epoch) return "signed-out"; // wiped while we were fetching: drop the response

    try {
      if ((await applySnapshot(body)) === "applied") return "synced";
    } catch {
      return "unavailable";
    }
    // A delta for a different user left the copy empty: ask again for everything.
    params.delete("since");
    params.delete("uid");
    params.delete("schema");
  }
  return "error";
}

/** Refreshes the offline copy from the server. Concurrent calls share one request. */
export function syncLibrary(fetchImpl: typeof fetch = fetch): Promise<SyncResult> {
  if (!inFlight) {
    inFlight = runSync(fetchImpl).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}
