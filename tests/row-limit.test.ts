import { describe, expect, it } from "vitest";
import { isRowLimitError, saveErrorMessage } from "@/lib/action-result";

describe("row limit errors", () => {
  const limit = { message: "row_limit_reached: prayers allows at most 500 rows per user" };

  it("recognises the database trigger message", () => {
    expect(isRowLimitError(limit)).toBe(true);
    expect(isRowLimitError({ message: "duplicate key" })).toBe(false);
    expect(isRowLimitError(null)).toBe(false);
  });

  it("explains a limit, otherwise keeps the fallback", () => {
    expect(saveErrorMessage(limit, "collections", "x")).toContain("limit for collections");
    expect(saveErrorMessage({ message: "boom" }, "collections", "fallback")).toBe("fallback");
  });
});
