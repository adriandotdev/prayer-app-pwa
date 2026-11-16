import { describe, expect, it } from "vitest";

import { filterPrayers } from "@/lib/prayers/filter";
import { searchTerms } from "@/lib/prayers/search";

const prayers = [
  { id: "1", user_id: null, title: "Our Father", body: "Our Father, who art in heaven" },
  { id: "2", user_id: null, title: "Hail Mary", body: "Hail Mary, full of grace" },
  { id: "3", user_id: "me", title: "Evening thanks", body: "Thank you for our day, Father" },
  { id: "4", user_id: "me", title: "Acts of Hope", body: "O my God, relying on your almighty power" },
];

describe("filterPrayers (offline twin of listPrayers)", () => {
  it("returns everything in title order", () => {
    expect(filterPrayers(prayers, new Set(), "all").map((p) => p.id)).toEqual(["4", "3", "2", "1"]);
  });

  it("applies the mine / starter / favorites filters", () => {
    expect(filterPrayers(prayers, new Set(), "mine").map((p) => p.id)).toEqual(["4", "3"]);
    expect(filterPrayers(prayers, new Set(), "starter").map((p) => p.id)).toEqual(["2", "1"]);
    expect(filterPrayers(prayers, new Set(["2", "4"]), "favorites").map((p) => p.id)).toEqual(["4", "2"]);
    expect(filterPrayers(prayers, new Set(), "favorites")).toEqual([]);
  });

  it("matches part of a word, case-insensitively, in the title or the body", () => {
    expect(filterPrayers(prayers, new Set(), "all", "OUR").map((p) => p.id)).toEqual(["4", "3", "1"]); // "your" contains "our"
    expect(filterPrayers(prayers, new Set(), "all", "alm").map((p) => p.id)).toEqual(["4"]);
  });

  it("requires every typed word to match", () => {
    expect(filterPrayers(prayers, new Set(), "all", "our father").map((p) => p.id)).toEqual(["3", "1"]);
    expect(filterPrayers(prayers, new Set(), "all", "our mary")).toEqual([]);
  });

  it("combines a filter with a search", () => {
    expect(filterPrayers(prayers, new Set(), "mine", "father").map((p) => p.id)).toEqual(["3"]);
  });

  it("ignores punctuation that could carry query syntax, and caps the terms at six", () => {
    expect(searchTerms("a,b)(c*d%e_ f g h")).toEqual(["abcde", "f", "g", "h"]);
    expect(searchTerms("1 2 3 4 5 6 7 8")).toHaveLength(6);
    // "%" and "," are stripped, so this reads as the single word "father".
    expect(filterPrayers(prayers, new Set(), "all", "%father,").map((p) => p.id)).toEqual(["3", "1"]);
  });

  it("does not mutate its input", () => {
    const copy = [...prayers];
    filterPrayers(prayers, new Set(), "all");
    expect(prayers).toEqual(copy);
  });
});
