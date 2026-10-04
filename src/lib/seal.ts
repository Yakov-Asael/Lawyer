/**
 * Glyph-by-glyph layout for the seal's ring text (spec 01).
 * textPath renders Hebrew inconsistently across browsers, so every grapheme gets its own rotation.
 * The text starts at the top and runs counter-clockwise, so it reads right to left.
 */

export type RingGlyph = { char: string; angle: number };

/** Split into user-perceived characters, so marks like ״ or nikud stay with their letter. */
function graphemes(text: string): string[] {
  const segmenter = new Intl.Segmenter("he", { granularity: "grapheme" });
  return Array.from(segmenter.segment(text), (s) => s.segment);
}

/**
 * Evenly spaced glyphs around a full circle. Angles are SVG rotations in degrees
 * (positive = clockwise), so negative steps move counter-clockwise.
 * A trailing separator is added so the end of the text does not touch its start.
 */
export function ringGlyphs(text: string, separator = " "): RingGlyph[] {
  const chars = graphemes(`${text.trim()}${separator}`);
  const step = 360 / chars.length;
  return chars.map((char, i) => ({ char, angle: i === 0 ? 0 : -i * step }));
}
