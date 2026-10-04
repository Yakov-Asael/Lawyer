import { splitNumbers } from "@/lib/numbers";

/** Text whose phone numbers, years and times render as isolated LTR runs (`.num`), so RTL never reorders them. */
export function NumText({ text }: { text: string }) {
  return (
    <>
      {splitNumbers(text).map((run, i) =>
        run.number ? (
          <span key={i} className="num">
            {run.text}
          </span>
        ) : (
          run.text
        ),
      )}
    </>
  );
}
