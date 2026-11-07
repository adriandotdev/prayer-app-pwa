import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { PROTECTED_PREFIXES } from "@/lib/auth/paths";

describe("service worker", () => {
  it("treats exactly the protected routes as private", () => {
    const source = readFileSync(path.resolve(__dirname, "../public/sw.js"), "utf8");
    const match = source.match(/PRIVATE_PREFIXES\s*=\s*\[([^\]]*)\]/);
    expect(match, "PRIVATE_PREFIXES not found in public/sw.js").not.toBeNull();
    const prefixes = [...match![1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
    expect(prefixes).toEqual([...PROTECTED_PREFIXES]);
  });
});
