import { describe, expect, it } from "vitest";
import { parseIsoDate, toIsoDate } from "@/lib/liturgy/dates";
import { usccbReadingsUrl } from "@/lib/liturgy/readings-link";

describe("usccbReadingsUrl", () => {
  it("formats MMDDYY", () => {
    expect(usccbReadingsUrl("2026-04-05")).toBe("https://bible.usccb.org/bible/readings/040526.cfm");
    expect(usccbReadingsUrl("2026-12-31")).toBe("https://bible.usccb.org/bible/readings/123126.cfm");
    expect(usccbReadingsUrl("2027-01-01")).toBe("https://bible.usccb.org/bible/readings/010127.cfm");
  });
});

describe("iso date helpers", () => {
  it("round-trips a local date", () => {
    expect(toIsoDate(parseIsoDate("2026-03-09"))).toBe("2026-03-09");
    expect(toIsoDate(new Date(2026, 0, 1, 0, 5))).toBe("2026-01-01");
    expect(toIsoDate(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
  });
});
