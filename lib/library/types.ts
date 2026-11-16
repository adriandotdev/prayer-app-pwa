/** Bump when the snapshot shape or the IndexedDB layout changes; clients then resync from scratch. */
export const LIBRARY_SCHEMA = 1;

/** Older than this, the offline copy is no longer trusted (the account may have changed or been signed out). */
export const MAX_COPY_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export type LibraryPrayer = {
  id: string;
  user_id: string | null;
  title: string;
  body: string;
  source: string | null;
  updated_at: string;
};

export type LibraryCollection = { id: string; name: string; sort_order: number };

export type LibraryMembership = { collection_id: string; prayer_id: string };

/** What `GET /api/library/snapshot` returns. `prayers` is the delta since `since`, or everything. */
export type LibrarySnapshot = {
  v: typeof LIBRARY_SCHEMA;
  userId: string;
  /** True when `prayers` holds every prayer rather than only the ones changed since `since`. */
  full: boolean;
  prayers: LibraryPrayer[];
  /** Every prayer the user can see, so the client can drop ones deleted on the server. */
  allPrayerIds: string[];
  favorites: string[];
  collections: LibraryCollection[];
  collectionPrayers: LibraryMembership[];
};

export type LibraryMeta = {
  key: "state";
  userId: string;
  schema: number;
  lastSyncAt: number;
  /** Newest prayers.updated_at held locally; the next sync asks for changes after it. */
  maxUpdatedAt: string | null;
};
