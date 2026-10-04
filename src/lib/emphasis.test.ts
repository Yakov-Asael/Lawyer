import { describe, expect, it } from "vitest";
import { splitAround } from "./emphasis";

describe("splitAround", () => {
  it("splits around the phrase", () => {
    expect(splitAround("אחת שתיים שלוש", "שתיים")).toEqual({ before: "אחת ", match: "שתיים", after: " שלוש" });
  });
  it("leaves the text whole when the phrase is missing or empty", () => {
    expect(splitAround("אחת", "שתיים")).toEqual({ before: "אחת", match: "", after: "" });
    expect(splitAround("אחת", "")).toEqual({ before: "אחת", match: "", after: "" });
  });
});
