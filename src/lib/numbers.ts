/** A piece of text, flagged when it is a number run (phone, year) that must render as an isolated LTR span. */
export type TextRun = { text: string; number: boolean };

/** Split text so phone numbers and similar digit runs can be wrapped in `.num` (spec 00, RTL rules). */
export function splitNumbers(text: string): TextRun[] {
  return text
    .split(/(\d[\d-]*\d)/)
    .filter(Boolean)
    .map((part) => ({ text: part, number: /^\d[\d-]*\d$/.test(part) }));
}
