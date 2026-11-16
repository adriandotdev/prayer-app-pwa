import "fake-indexeddb/auto";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearDeviceData } from "@/lib/device-data";
import { readAll } from "@/lib/library/db";
import { applySnapshot, getMeta } from "@/lib/library/sync";
import { LIBRARY_SCHEMA } from "@/lib/library/types";

const store = new Map<string, string>();
const postMessage = vi.fn();

beforeEach(() => {
  store.clear();
  postMessage.mockReset();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
  });
  vi.stubGlobal("navigator", { onLine: true, serviceWorker: { controller: { postMessage } } });
});

describe("clearDeviceData", () => {
  it("forgets the offline library, the queued Rosaries and the cached private pages", async () => {
    store.set("ora:rosary-pending:v1", JSON.stringify([{ setId: "joyful", completedAt: new Date().toISOString() }]));
    await applySnapshot({
      v: LIBRARY_SCHEMA,
      userId: "u1",
      full: true,
      prayers: [{ id: "p1", user_id: null, title: "Our Father", body: "x", source: null, updated_at: "2026-11-01T00:00:00Z" }],
      allPrayerIds: ["p1"],
      favorites: ["p1"],
      collections: [],
      collectionPrayers: [],
    });

    await clearDeviceData();

    expect(await readAll("prayers")).toEqual([]);
    expect(await readAll("favorites")).toEqual([]);
    expect(await getMeta()).toBeUndefined();
    expect(store.has("ora:rosary-pending:v1")).toBe(false);
    expect(postMessage).toHaveBeenCalledWith({ type: "clear-private-pages" });
  });
});
