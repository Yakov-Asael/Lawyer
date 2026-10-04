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
- Files are `position: sticky`, `top: 128px`, so each new file slides over the previous one.
- The stack folds to two tabs (owner feedback): as the next file arrives, the current one lifts 44px (one tab height)
  with `translateY`, so at rest only the previous tab (at 84px) and the current tab (at 128px) are visible. Files two
  or more back sit exactly under the previous one and are hidden (`visibility`), so a wider tab never peeks out.
- A covered file only dims (`brightness(1 - overlap * .25)`). No scaling: every file keeps the same width so edges and
  tabs stay aligned (owner feedback).

## Behavior
CTA → `waLink(whatsappTopic)`, e.g. "...אשמח להתייעץ בנושא דיני משפחה."

## Fallbacks
Reduced motion: no dimming (stacking remains, it is layout, not animation).
Phones: body top padding 52px so a covered file shows only a clean strip, not the top of its heading.

## Accessibility
Each file is an `<article>` with its headline as `<h3>`; service lists are `<ul>`.

## Acceptance criteria
- [ ] Tab and body touch with zero gap (measured) at 1440 and 390; tab right edge equals body right edge.
- [ ] Each CTA opens WhatsApp with its own topic in the message.
- [ ] While scrolling the stack, at most two tabs are visible at rest (previous at 84px, current at 128px), labels fully readable.
- [ ] All five bodies share the same left and right edges while stacked (measured).
- [ ] Service lists come from content; no hardcoded items.
