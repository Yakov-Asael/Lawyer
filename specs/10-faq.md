# 10 FAQ

## Purpose
Answer the questions that stop people from reaching out, and send the rest to WhatsApp.

## Content
`faq[]` (min 3): question + answer. Heading "לפני שפונים." Intro "לא מצאתם תשובה? שלחו את השאלה בוואטסאפ."
Draft questions: how to book, first-meeting cost, what to bring, confidentiality, notary without a case,
clients outside Hadera. **Answers come from Yossi**; the confidentiality answer needs his wording approval.

## Layout
- On `stone`, max 1180px. ≥900px: two columns `.8fr / 1.2fr`, head sticky at `top:110px`. Phones: stacked.
- List with a top `ink` rule; each item separated by a `bark` hairline.
- Question: serif 500 `clamp(1.25rem, 1.9vw, 1.6rem)` (1.02rem phones), hover `brass-deep`.
- Toggle: 34px round, plus that turns into minus (the vertical bar rotates away), fills `ink` when open.
- Answer: `muted` 17px (15px phones), max 36em.

## Behavior
Multiple items may be open at once. Smooth height animation (`::details-content` / `interpolate-size`), instant under
reduced motion.

## Implementation notes
shadcn `Accordion` (`type="multiple"`) restyled, or native `<details>/<summary>` (works without JS).
Emit `FAQPage` JSON-LD from the same content (see spec 16).

## Implementation (built)
- `src/components/sections/Faq.tsx` (server), native `<details>/<summary>`: keyboard operable and works without JS.
  Chromium exposes each summary as a focusable disclosure with the right `expanded` state (checked in the AX tree).
- Placeholder answers: `publishedFaq()` (`src/lib/faq.ts`, tested) keeps them on previews so the owner can see what is
  open, and drops them on a production build. FAQ answers are therefore exempt from the production placeholder guard
  (`blockingPlaceholders()` in `content/index.ts`); every other placeholder still blocks.
- JSON-LD (`faqJsonLd()`) is built from exactly the rendered items.
- Phone numbers inside answers render as isolated LTR runs (`splitNumbers()`, tested).
- Head copy in `content.faqHead`; the head is sticky at 110px from 900px.

## Acceptance criteria
- [ ] Each question is a keyboard-operable control with correct `aria-expanded`.
- [ ] No placeholder answers in production; an item without an answer is excluded.
- [ ] JSON-LD questions match the visible questions exactly.
