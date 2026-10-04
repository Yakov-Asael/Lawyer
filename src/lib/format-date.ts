/** An ISO date ("2026-10-04") as Israelis write it ("04.10.2026"). Pure string work: no time zone can shift it. */
export function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Not an ISO date: ${iso}`);
  const [, y, m, d] = match;
  return `${d}.${m}.${y}`;
}
