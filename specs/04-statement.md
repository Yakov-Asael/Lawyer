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

## Acceptance criteria
- [ ] Scrolling through the section lights all words by the time the paragraph is fully in view.
- [ ] Highlight phrase is exactly `statement.highlight`, in `brass-deep`.
- [ ] VoiceOver reads the sentence naturally, without word-by-word pauses.
