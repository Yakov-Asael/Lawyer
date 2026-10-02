/** One piece of a paragraph split for word-by-word effects. Whitespace stays its own piece. */
export type WordPiece = { text: string; space: boolean; highlight: boolean };

/**
 * Split `text` into words and whitespace, marking the words that belong to the first occurrence of
 * `highlight`. Joining every piece's text gives back the original string.
 */
export function splitWords(text: string, highlight = ""): WordPiece[] {
  const at = highlight ? text.indexOf(highlight) : -1;
  const end = at + highlight.length;
  const pieces: WordPiece[] = [];
  let offset = 0;
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    const space = /^\s+$/.test(part);
    pieces.push({ text: part, space, highlight: !space && at >= 0 && offset >= at && offset + part.length <= end });
    offset += part.length;
  }
  return pieces;
}
