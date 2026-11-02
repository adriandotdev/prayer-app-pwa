import { describe, expect, it } from "vitest";
import { isProtectedPath, safeNext } from "@/lib/auth/paths";
import { collectionSchema } from "@/lib/collections/schema";
import { parseFilter, parseQuery, prayerSchema } from "@/lib/prayers/schema";
import { formId, isUuid } from "@/lib/validation";

describe("isUuid", () => {
  it("accepts uuids and rejects everything else", () => {
    expect(isUuid("00000000-0000-4000-8000-000000000001")).toBe(true);
    expect(isUuid("00000000-0000-4000-8000-00000000000G")).toBe(false);
    expect(isUuid("")).toBe(false);
    expect(isUuid("1; drop table prayers")).toBe(false);
  });
});

describe("formId", () => {
  const id = "00000000-0000-4000-8000-000000000001";

  it("returns a valid uuid field", () => {
    const fd = new FormData();
    fd.set("id", id);
    expect(formId(fd)).toBe(id);
  });

  it("returns null for missing, malformed and file fields", () => {
    const fd = new FormData();
    expect(formId(fd)).toBeNull();
    fd.set("id", "not-a-uuid");
    expect(formId(fd)).toBeNull();
    fd.set("other", new File(["x"], "x.txt"));
    expect(formId(fd, "other")).toBeNull();
  });
});

describe("safeNext", () => {
  it("allows same-site paths", () => {
    expect(safeNext("/prayers?q=hail")).toBe("/prayers?q=hail");
  });

  it.each(["//evil.com", "/\\evil.com", "https://evil.com", "evil", "", null, undefined])("rejects %s", (value) => {
    expect(safeNext(value)).toBe("/profile");
  });

  it("uses the given fallback", () => {
    expect(safeNext("//x", "/")).toBe("/");
  });
});

describe("isProtectedPath", () => {
  it("protects the library but not the Rosary or sign-in", () => {
    for (const p of ["/prayers", "/prayers/abc", "/collections", "/intentions/x", "/profile"]) expect(isProtectedPath(p)).toBe(true);
    for (const p of ["/", "/rosary", "/login", "/prayersfoo"]) expect(isProtectedPath(p)).toBe(false);
  });
});

describe("prayerSchema", () => {
  it("trims and accepts a valid prayer", () => {
    const r = prayerSchema.safeParse({ title: "  Hail Mary ", body: " Hail Mary, full of grace ", source: "" });
    expect(r.success && r.data.title).toBe("Hail Mary");
  });

  it("rejects empty and oversized fields", () => {
    expect(prayerSchema.safeParse({ title: " ", body: "x", source: "" }).success).toBe(false);
    expect(prayerSchema.safeParse({ title: "x", body: "", source: "" }).success).toBe(false);
    expect(prayerSchema.safeParse({ title: "x", body: "x".repeat(20001), source: "" }).success).toBe(false);
    expect(prayerSchema.safeParse({ title: "x", body: "x", source: "x".repeat(201) }).success).toBe(false);
  });
});

describe("collectionSchema", () => {
  it("requires a name up to 100 characters", () => {
    expect(collectionSchema.safeParse({ name: "" }).success).toBe(false);
    expect(collectionSchema.safeParse({ name: "x".repeat(101) }).success).toBe(false);
    expect(collectionSchema.safeParse({ name: "Evening" }).success).toBe(true);
  });
});

describe("library query params", () => {
  it("parseFilter falls back to all", () => {
    expect(parseFilter("mine")).toBe("mine");
    expect(parseFilter(["favorites", "mine"])).toBe("favorites");
    expect(parseFilter("bogus")).toBe("all");
    expect(parseFilter(undefined)).toBe("all");
  });

  it("parseQuery trims and caps at 100 characters", () => {
    expect(parseQuery("  our father ")).toBe("our father");
    expect(parseQuery("x".repeat(150))).toHaveLength(100);
    expect(parseQuery(undefined)).toBe("");
  });
});
