import { describe, expect, it } from "vitest";
import { splitNumbers } from "./numbers";

describe("splitNumbers", () => {
  it("isolates phone numbers, years and times; leaves text and single digits alone", () => {
    const runs = splitNumbers("קומה 1. בין 8:00 ל-18:00, טלפון 052-252-1127, משנת 2003.");
    expect(runs.filter((r) => r.number).map((r) => r.text)).toEqual(["8:00", "18:00", "052-252-1127", "2003"]);
    expect(runs.map((r) => r.text).join("")).toBe("קומה 1. בין 8:00 ל-18:00, טלפון 052-252-1127, משנת 2003.");
  });
});
