import "fake-indexeddb/auto";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { readAll } from "@/lib/library/db";
import { applySnapshot, getMeta, syncLibrary, wipeLibrary } from "@/lib/library/sync";
import { LIBRARY_SCHEMA, type LibraryPrayer, type LibrarySnapshot } from "@/lib/library/types";

const A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function prayer(id: string, title: string, updated_at: string, user_id: string | null = null): LibraryPrayer {
  return { id, user_id, title, body: `${title} body`, source: null, updated_at };
}

function snapshot(overrides: Partial<LibrarySnapshot> = {}): LibrarySnapshot {
  return {
    v: LIBRARY_SCHEMA,
    userId: A,
    full: true,
    prayers: [prayer("p1", "Our Father", "2026-11-01T10:00:00+00:00"), prayer("p2", "Hail Mary", "2026-11-02T10:00:00+00:00")],
    allPrayerIds: ["p1", "p2"],
    favorites: ["p1"],
    collections: [{ id: "c1", name: "Morning", sort_order: 0 }],
    collectionPrayers: [{ collection_id: "c1", prayer_id: "p2" }],
    ...overrides,
  };
}

const ids = async (store: "prayers" | "favorites" | "collections") =>
  (await readAll<Record<string, string>>(store)).map((r) => r.id ?? r.prayer_id).sort();

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

beforeEach(async () => {
  await wipeLibrary();
});

describe("applySnapshot", () => {
  it("stores a full snapshot and records what the next sync should ask for", async () => {
    expect(await applySnapshot(snapshot())).toBe("applied");
    expect(await ids("prayers")).toEqual(["p1", "p2"]);
    expect(await ids("favorites")).toEqual(["p1"]);
    expect(await readAll("collectionPrayers")).toEqual([{ collection_id: "c1", prayer_id: "p2" }]);
    const meta = await getMeta();
    expect(meta).toMatchObject({ userId: A, schema: LIBRARY_SCHEMA, maxUpdatedAt: "2026-11-02T10:00:00+00:00" });
  });

  it("merges a delta, replaces the small tables and drops prayers deleted on the server", async () => {
    await applySnapshot(snapshot());
    await applySnapshot(
      snapshot({
        full: false,
        prayers: [prayer("p1", "Our Father (edited)", "2026-11-05T10:00:00+00:00")],
        allPrayerIds: ["p1"], // p2 was deleted elsewhere
        favorites: [],
        collections: [],
        collectionPrayers: [],
      }),
    );
    expect(await readAll<LibraryPrayer>("prayers")).toEqual([expect.objectContaining({ id: "p1", title: "Our Father (edited)" })]);
    expect(await readAll("favorites")).toEqual([]);
    expect(await readAll("collections")).toEqual([]);
    expect((await getMeta())?.maxUpdatedAt).toBe("2026-11-05T10:00:00+00:00");
  });

  it("keeps the newest updated_at when a delta carries older rows", async () => {
    await applySnapshot(snapshot());
    await applySnapshot(snapshot({ full: false, prayers: [prayer("p1", "Our Father", "2026-11-01T10:00:00+00:00")] }));
    expect((await getMeta())?.maxUpdatedAt).toBe("2026-11-02T10:00:00+00:00");
  });

  it("wipes another user's copy before writing", async () => {
    await applySnapshot(snapshot());
    await applySnapshot(
      snapshot({ userId: B, prayers: [prayer("p9", "Mine", "2026-11-03T10:00:00+00:00", B)], allPrayerIds: ["p9"], favorites: [], collections: [], collectionPrayers: [] }),
    );
    expect(await ids("prayers")).toEqual(["p9"]);
    expect((await getMeta())?.userId).toBe(B);
  });

  it("refuses a delta for a different user and leaves nothing behind", async () => {
    await applySnapshot(snapshot());
    expect(await applySnapshot(snapshot({ userId: B, full: false }))).toBe("needs-full");
    expect(await readAll("prayers")).toEqual([]);
    expect(await getMeta()).toBeUndefined();
  });
});

describe("syncLibrary", () => {
  it("asks for everything the first time, then only for changes for the same user", async () => {
    const fetchMock = vi.fn().mockResolvedValue(respond(snapshot()));
    expect(await syncLibrary(fetchMock as unknown as typeof fetch)).toBe("synced");
    expect(fetchMock.mock.calls[0][0]).toBe("/api/library/snapshot");

    fetchMock.mockResolvedValue(respond(snapshot({ full: false, prayers: [] })));
    await syncLibrary(fetchMock as unknown as typeof fetch);
    const url = new URL(String(fetchMock.mock.calls[1][0]), "http://x");
    expect(url.searchParams.get("since")).toBe("2026-11-02T10:00:00+00:00");
    expect(url.searchParams.get("uid")).toBe(A);
    expect(url.searchParams.get("schema")).toBe(String(LIBRARY_SCHEMA));
  });

  it("wipes the copy when the server says the visitor is signed out", async () => {
    await applySnapshot(snapshot());
    const fetchMock = vi.fn().mockResolvedValue(respond({ error: "no" }, 401));
    expect(await syncLibrary(fetchMock as unknown as typeof fetch)).toBe("signed-out");
    expect(await readAll("prayers")).toEqual([]);
    expect(await getMeta()).toBeUndefined();
  });

  it("keeps the copy when offline or when the server fails", async () => {
    await applySnapshot(snapshot());
    expect(await syncLibrary(vi.fn().mockRejectedValue(new TypeError("offline")) as unknown as typeof fetch)).toBe("offline");
    expect(await syncLibrary(vi.fn().mockResolvedValue(respond({}, 500)) as unknown as typeof fetch)).toBe("error");
    expect(await ids("prayers")).toEqual(["p1", "p2"]);
  });

  it("rejects a malformed or wrong-version body without touching the copy", async () => {
    await applySnapshot(snapshot());
    expect(await syncLibrary(vi.fn().mockResolvedValue(respond({ v: 99 })) as unknown as typeof fetch)).toBe("error");
    expect(await ids("prayers")).toEqual(["p1", "p2"]);
  });

  it("falls back to a full request when a delta lands on another user's copy", async () => {
    await applySnapshot(snapshot());
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respond(snapshot({ userId: B, full: false })))
      .mockResolvedValueOnce(respond(snapshot({ userId: B, prayers: [prayer("p9", "Mine", "2026-11-03T10:00:00+00:00", B)], allPrayerIds: ["p9"], favorites: [], collections: [], collectionPrayers: [] })));
    expect(await syncLibrary(fetchMock as unknown as typeof fetch)).toBe("synced");
    expect(new URL(String(fetchMock.mock.calls[1][0]), "http://x").searchParams.has("since")).toBe(false);
    expect(await ids("prayers")).toEqual(["p9"]);
  });

  it("drops a response that arrives after the library was wiped", async () => {
    let release!: (r: Response) => void;
    const fetchMock = vi.fn().mockReturnValue(new Promise<Response>((resolve) => (release = resolve)));
    const pending = syncLibrary(fetchMock as unknown as typeof fetch);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await wipeLibrary(); // e.g. the user signed out meanwhile
    release(respond(snapshot()));
    expect(await pending).toBe("signed-out");
    expect(await readAll("prayers")).toEqual([]);
  });

  it("shares one request between concurrent calls", async () => {
    const fetchMock = vi.fn().mockResolvedValue(respond(snapshot()));
    const f = fetchMock as unknown as typeof fetch;
    await Promise.all([syncLibrary(f), syncLibrary(f)]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
