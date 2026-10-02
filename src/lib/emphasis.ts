/** Split `text` around the first occurrence of `phrase`, for rendering one emphasized span inside plain copy. */
export function splitAround(text: string, phrase: string): { before: string; match: string; after: string } {
  const at = phrase ? text.indexOf(phrase) : -1;
  if (at < 0) return { before: text, match: "", after: "" };
  return { before: text.slice(0, at), match: phrase, after: text.slice(at + phrase.length) };
}
