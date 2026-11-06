import { describe, expect, it } from "vitest";

import { isProtectedPath, safeNext } from "@/lib/auth/paths";

describe("safeNext", () => {
  it("keeps same-site relative paths, including query strings", () => {
    expect(safeNext("/prayers")).toBe("/prayers");
    expect(safeNext("/prayers/abc?tab=1")).toBe("/prayers/abc?tab=1");
  });

  it.each([
    ["protocol-relative", "//evil.com"],
    ["backslash trick", "/\\evil.com"],
    ["absolute http", "https://evil.com"],
    ["javascript scheme", "javascript:alert(1)"],
    ["relative without slash", "prayers"],
    ["empty", ""],
  ])("falls back for %s", (_label, input) => {
    expect(safeNext(input)).toBe("/profile");
  });

  it("falls back for null and undefined", () => {
    expect(safeNext(null)).toBe("/profile");
    expect(safeNext(undefined)).toBe("/profile");
  });

  it("honors a custom fallback", () => {
    expect(safeNext("//evil.com", "/")).toBe("/");
  });
});

describe("isProtectedPath", () => {
  it("protects the library prefixes and their children", () => {
    for (const p of ["/prayers", "/collections/x", "/intentions", "/profile/export"]) {
      expect(isProtectedPath(p)).toBe(true);
    }
  });

  it("leaves public routes and lookalike prefixes open", () => {
    for (const p of ["/", "/rosary", "/login", "/offline", "/prayersfoo", "/profiles"]) {
      expect(isProtectedPath(p)).toBe(false);
    }
  });
});
