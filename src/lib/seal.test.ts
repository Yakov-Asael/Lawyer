import { describe, expect, it } from "vitest";
import { ringGlyphs } from "./seal";

describe("ringGlyphs", () => {
  const text = "עורך דין ונוטריון · חדרה · שוקרון כהן ·";

  it("places the first glyph at the top", () => {
    const [first] = ringGlyphs(text);
    expect(first).toEqual({ char: "ע", angle: 0 });
  });

  it("runs counter-clockwise (right to left) in even steps around the full circle", () => {
    const glyphs = ringGlyphs(text);
    const step = 360 / glyphs.length;
    glyphs.forEach((g, i) => expect(g.angle).toBeCloseTo(-i * step));
    expect(glyphs.at(-1)!.angle).toBeGreaterThan(-360);
  });

  it("keeps the text in reading order and adds one trailing gap", () => {
    const glyphs = ringGlyphs(text);
    expect(glyphs.map((g) => g.char).join("")).toBe(`${text} `);
  });

  it("keeps a combining mark with its letter", () => {
    const glyphs = ringGlyphs("שָׁלוֹם");
    expect(glyphs.map((g) => g.char)).toEqual(["שָׁ", "ל", "וֹ", "ם", " "]);
  });
});
