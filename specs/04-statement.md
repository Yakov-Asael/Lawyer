# 04 Statement

## Purpose
Speak to the visitor's situation and state the core promise: someone who knows your case and explains it plainly.

## Content
`statement.text` with `statement.highlight` (rendered in `brass-deep`), `statement.footLabel` ("בלי מתווכים"),
`statement.footText`.

## Layout
- On `stone`, max-width 1280px, generous padding `clamp(90px, 13vw, 190px)` top (72px phones).
- Paragraph in serif 500 at display size (see tokens), `text-wrap: pretty`.
- Footer row: eyebrow + one sentence in `muted`.

## Motion (signature)
Words "light up" as the reader scrolls: each word starts at opacity .16 and becomes 1 as scroll progress passes it.
Progress window: from the paragraph top reaching 82% of the viewport, across its height plus 25% of the viewport.

## Fallbacks
Reduced motion / "stop animations": all words at full opacity.
Screen readers read the paragraph as one text node (word spans are presentational only).

## Implementation notes
`src/components/sections/Statement.tsx`; word splitting done at render (not by mutating the DOM after mount), highlight
words carry a class. Uses `useScrollProgress`.

## Implementation (built)
- `src/components/sections/Statement.tsx`. Words split at render by `splitWords()` (`src/lib/words.ts`, tested).
- Progress window: `readingProgress()` in `src/lib/motion/progress.ts` (82% start, height + 25% span), passed to
  `useScrollProgress` as its `measure`. Only words whose lit state changes are touched per frame.
- Screen readers: the word spans sit in one `aria-hidden` wrapper and a visually hidden copy of the paragraph carries
  the text, so the sentence is read once, whole.
- Dim state exists only under `html.motion` (and is covered by the no-hydration failsafe).
- Note on the criterion below: with this window the last word lights when the paragraph's bottom reaches about 57% of
  the viewport, i.e. while it is fully in view in the upper half. That is what the test checks.
- Copy: `statement.label` ("גישה אישית") names the section landmark.

## Acceptance criteria
- [ ] Scrolling through the section lights all words by the time the paragraph is fully in view.
- [ ] Highlight phrase is exactly `statement.highlight`, in `brass-deep`.
- [ ] VoiceOver reads the sentence naturally, without word-by-word pauses.
