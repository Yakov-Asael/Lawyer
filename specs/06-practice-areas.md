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

## Implementation (built)
- `src/components/sections/PracticeAreas.tsx` (server) renders the head and the four `<article>` files;
  `FileStack.tsx` (client) only adds the dimming, from `overlapRatio()` (`src/lib/motion/progress.ts`, tested), on the
  shared frame loop. Stacking is pure CSS (`sticky`, `top: calc(84px + var(--i) * 44px)`).
- The last file is the end of the stack: it arrives at its 44px slot instead of sticking (no room left in its
  container). That moment is when all four tabs are stacked, and what the test measures.
- Colours per file are presentation in the component (`TONES`), not content. On the brass file the focus ring switches
  to ink, because brass-deep on brass is too faint.
- Section head copy lives in `content.areas`. While services are unconfirmed each file shows
  `servicesNote` ("[placeholder: רשימה לאישור יוסי]"), which also blocks a production build.

## Acceptance criteria
- [ ] Tab and body touch with zero gap (measured) at 1440 and 390; tab right edge equals body right edge.
- [ ] Each CTA opens WhatsApp with its own topic in the message.
- [ ] While scrolling the stack, at most two tabs are visible at rest (previous at 84px, current at 128px), labels fully readable.
- [ ] All five bodies share the same left and right edges while stacked (measured).
- [ ] Service lists come from content; no hardcoded items.

## Implementation update (2026-10-04, owner feedback)
- Five files (family, real estate, torts, civil and commercial, notary); colours ink, field, paper, ink, brass.
- Every file is `sticky top-[128px]`. `FileStack` folds the stack: the current file lifts `44px * foldProgress`
  as the next one arrives (`foldProgress` in `src/lib/motion/progress.ts`, over 220px), and a file two places back is
  hidden (`foldHidden`). With motion off there is no lift or dimming; covered files are hidden under the current one.
