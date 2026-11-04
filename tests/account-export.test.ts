import { describe, expect, it } from "vitest";

import { buildExport, EXPORT_VERSION, type ExportInput } from "@/lib/export/serialize";

const USER = "user-1";
const NOW = new Date("2026-11-04T10:00:00Z");

function input(overrides: Partial<ExportInput> = {}): ExportInput {
  return {
    userId: USER,
    email: "a@example.com",
    profile: null,
    prayers: [],
    collections: [],
    collectionPrayers: [],
    favorites: [],
    intentions: [],
    rosarySessions: [],
    exportedAt: NOW,
    ...overrides,
  };
}

const prayer = (id: string, user_id: string | null) => ({
  id,
  user_id,
  title: `Prayer ${id}`,
  body: "Body",
  source: null,
  is_favorite: true,
  search: "'tsvector'",
  created_at: "2026-10-01T00:00:00Z",
  updated_at: "2026-10-02T00:00:00Z",
});

describe("buildExport", () => {
  it("returns an empty, versioned export for a new user", () => {
    const out = buildExport(input());
    expect(out.version).toBe(EXPORT_VERSION);
    expect(out.exportedAt).toBe(NOW.toISOString());
    expect(out.account).toEqual({ id: USER, email: "a@example.com" });
    expect(out.profile).toBeNull();
    expect(out.prayers).toEqual([]);
    expect(out.collections).toEqual([]);
    expect(out.favorites).toEqual([]);
    expect(out.intentions).toEqual([]);
    expect(out.rosarySessions).toEqual([]);
  });

  it("keeps only the user's own prayers and strips internal columns", () => {
    const out = buildExport(input({ prayers: [prayer("mine", USER), prayer("starter", null)] }));
    expect(out.prayers.map((p) => p.id)).toEqual(["mine"]);
    expect(Object.keys(out.prayers[0]).sort()).toEqual(["body", "createdAt", "id", "source", "title", "updatedAt"]);
  });

  it("keeps favorites that point at starter prayers", () => {
    const out = buildExport(
      input({ favorites: [{ user_id: USER, prayer_id: "starter", created_at: "2026-10-03T00:00:00Z" }] }),
    );
    expect(out.favorites).toEqual([{ prayerId: "starter", createdAt: "2026-10-03T00:00:00Z" }]);
  });

  it("orders collections and their prayers by sort_order", () => {
    const col = (id: string, sort_order: number) => ({
      id,
      user_id: USER,
      name: id,
      sort_order,
      created_at: "2026-10-01T00:00:00Z",
    });
    const out = buildExport(
      input({
        collections: [col("b", 2), col("a", 1)],
        collectionPrayers: [
          { collection_id: "a", prayer_id: "p2", sort_order: 2 },
          { collection_id: "a", prayer_id: "p1", sort_order: 1 },
          { collection_id: "b", prayer_id: "p3", sort_order: 1 },
        ],
      }),
    );
    expect(out.collections.map((c) => c.id)).toEqual(["a", "b"]);
    expect(out.collections[0].prayerIds).toEqual(["p1", "p2"]);
    expect(out.collections[1].prayerIds).toEqual(["p3"]);
  });

  it("maps intentions and Rosary sessions without the user id", () => {
    const out = buildExport(
      input({
        intentions: [
          { id: "i1", user_id: USER, text: "Peace", is_answered: true, answered_at: "2026-10-05T00:00:00Z", created_at: "2026-10-01T00:00:00Z" },
        ],
        rosarySessions: [
          { id: "s1", user_id: USER, mystery_set: "joyful", completed_at: "2026-10-06T00:00:00Z", client_id: "c1", intention_id: "i1" },
        ],
      }),
    );
    expect(out.intentions[0]).toEqual({
      id: "i1",
      text: "Peace",
      isAnswered: true,
      answeredAt: "2026-10-05T00:00:00Z",
      createdAt: "2026-10-01T00:00:00Z",
    });
    expect(out.rosarySessions[0]).toEqual({
      id: "s1",
      mysterySet: "joyful",
      completedAt: "2026-10-06T00:00:00Z",
      intentionId: "i1",
    });
  });
});
