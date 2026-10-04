/** A piece of text, flagged when it is a number run (phone, year) that must render as an isolated LTR span. */
export type TextRun = { text: string; number: boolean };

/** A digit run of two or more characters: phone numbers (052-252-1127), years (2003), times (8:00). */
const RUN = /(\d[\d:-]*\d)/;

/** Split text so phone numbers, years and times can be wrapped in `.num` (spec 00, RTL rules). */
export function splitNumbers(text: string): TextRun[] {
  return text
    .split(RUN)
    .filter(Boolean)
    .map((part) => ({ text: part, number: new RegExp(`^${RUN.source}$`).test(part) }));
}
