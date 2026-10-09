# 06 Practice areas (stacked files)

## Purpose
Let the visitor find their topic in seconds and start a WhatsApp conversation already labeled with it.

## Content
`practiceAreas[5]`: tabLabel, headline, lead, services (3 to 6), whatsappTopic, ctaLabel. Order: family and inheritance,
real estate, torts and insurance, civil and commercial, notary.

## Layout
- Section head: eyebrow "תחומי עיסוק", H2 "חמישה תחומים, / עורך דין אחד.", intro paragraph.
- Five "court files", each = tab + body:
  - Tab: `display:flex; width:fit-content`, flush with the body's start edge, `margin-block-end:-1px` (no gap),
    top radius 14px, 14px / 700 / tracking .06em, small dot before the label.
  - Body: `radius-md` with the start-top corner square (where the tab sits), padding `clamp(28px, 4vw, 52px)`,
    min-height `clamp(340px, 44vh, 420px)`. ≥900px two columns: headline + lead + CTA / service list. Phones: one column.
- Colors per file: 1 `ink`, 2 `field`, 3 `paper`, 4 `ink`, 5 `brass` (text and CTA variant adapt: `brass` button on dark files,
  `ink` button on light files).

## Motion (signature)
- Divider tabs (owner feedback, 2026-10-09): every file is `position: sticky; top: 84px`, and its tab sits in its own
  slot of a single row (`width: (100% - 4 * gap) / 5`, `margin-inline-start: i * (tab width + gap)`). When a new file
  slides over the previous one it covers only the body, so the tabs of every file already passed stay readable, like
  dividers in a binder. The section never grows taller than one tab row plus one body.
- Phones: the same row with short labels (משפחה, נדל״ן, ביטוח, אזרחי, נוטריון); the full label stays available to
  screen readers.
- A covered file only dims (`brightness(1 - overlap * .25)`). No scaling: every file keeps the same width so edges and
  tabs stay aligned (owner feedback).

## Behavior
CTA → `waLink(whatsappTopic)`, e.g. "...אשמח להתייעץ בנושא דיני משפחה."

## Fallbacks
Reduced motion: no dimming (stacking remains, it is layout, not animation).

## Accessibility
Each file is an `<article>` with its headline as `<h3>`; service lists are `<ul>`.

## Acceptance criteria
- [ ] Tab and body touch with zero gap (measured) at 1440 and 390; tab right edge equals body right edge.
- [ ] Each CTA opens WhatsApp with its own topic in the message.
- [ ] While scrolling, the tabs of all files already reached stay visible in one row, labels fully readable, at 390 and 1440.
- [ ] All five bodies share the same left and right edges while stacked (measured).
- [ ] Service lists come from content; no hardcoded items.
