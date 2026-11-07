/**
 * Thin IndexedDB layer for the offline library. Hand-rolled on purpose: the surface is tiny and a
 * dependency would count against the initial-JS budget. Everything here is client-only and is
 * loaded lazily, never from public routes.
 */

const DB_NAME = "ora-library";
const DB_VERSION = 1;

export const STORES = ["meta", "prayers", "favorites", "collections", "collectionPrayers", "queue"] as const;
export type StoreName = (typeof STORES)[number];

const KEY_PATHS: Record<StoreName, string | string[]> = {
  meta: "key",
  prayers: "id",
  favorites: "prayer_id",
  collections: "id",
  collectionPrayers: ["collection_id", "prayer_id"],
  // Created now so the later offline-write queue needs no version bump.
  queue: "id",
};

let dbPromise: Promise<IDBDatabase> | null = null;

export function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: KEY_PATHS[name] });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      // Let a newer tab upgrade the database, and reopen lazily afterwards.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      db.onclose = () => {
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = () => reject(request.error ?? new Error("Could not open the offline library"));
    request.onblocked = () => reject(new Error("The offline library is blocked by another tab"));
  }).catch((error) => {
    dbPromise = null;
    throw error;
  });
  return dbPromise;
}

/**
 * Runs `work` inside one transaction and resolves when it commits. Keep `work` synchronous (chain
 * request callbacks, never await anything else): a transaction closes as soon as the event loop
 * has nothing pending on it.
 */
export async function transact(
  stores: readonly StoreName[],
  mode: IDBTransactionMode,
  work: (tx: IDBTransaction) => void,
): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([...stores], mode);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Offline library write failed"));
    tx.onabort = () => reject(tx.error ?? new Error("Offline library write aborted"));
    work(tx);
  });
}

export async function readAll<T>(store: StoreName): Promise<T[]> {
  const db = await openDb();
  return new Promise<T[]>((resolve, reject) => {
    const request = db.transaction(store, "readonly").objectStore(store).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error ?? new Error("Offline library read failed"));
  });
}

export async function readOne<T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> {
  const db = await openDb();
  return new Promise<T | undefined>((resolve, reject) => {
    const request = db.transaction(store, "readonly").objectStore(store).get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error ?? new Error("Offline library read failed"));
  });
}

/** Empties every store in one transaction. Cheaper and safer than deleting the database, which blocks on open tabs. */
export async function clearAllStores(): Promise<void> {
  await transact(STORES, "readwrite", (tx) => {
    for (const name of STORES) tx.objectStore(name).clear();
  });
}
