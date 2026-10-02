import { describe, expect, it } from "vitest";
import { splitWords } from "./words";

const text = "כשעומדים מול גירושין, הדבר החשוב ביותר הוא לדעת.";

describe("splitWords", () => {
  it("round-trips to the original text", () => {
    expect(splitWords(text, "הדבר החשוב ביותר").map((p) => p.text).join("")).toBe(text);
  });
  it("marks exactly the highlight words", () => {
    const hl = splitWords(text, "הדבר החשוב ביותר").filter((p) => p.highlight).map((p) => p.text);
    expect(hl).toEqual(["הדבר", "החשוב", "ביותר"]);
  });
  it("keeps whitespace as separate, never-highlighted pieces", () => {
    const pieces = splitWords("א  ב", "א  ב");
    expect(pieces.map((p) => [p.text, p.space, p.highlight])).toEqual([
      ["א", false, true],
      ["  ", true, false],
      ["ב", false, true],
    ]);
  });
  it("highlights nothing when the phrase is absent", () => {
    expect(splitWords(text, "לא קיים").some((p) => p.highlight)).toBe(false);
  });
});
