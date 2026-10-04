import { describe, expect, it } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("writes an ISO date as dd.mm.yyyy", () => {
    expect(formatDate("2026-10-04")).toBe("04.10.2026");
  });
  it("rejects anything else", () => {
    expect(() => formatDate("04/10/2026")).toThrow();
  });
});
