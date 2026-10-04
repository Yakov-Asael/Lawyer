# 05 Years of practice

## Purpose
Make the one hard number the office has (23 years) physical and memorable.

## Content
`office.yearsOfPractice`, `years.heading`, `years.body`, `office.education` (optional; omitted if missing).

## Layout
- Rounded `field` card. ≥900px: two columns (`auto 1fr`), numeral at start, text at end. Phones: stacked.
- Numeral: serif 900 at `clamp(9rem, 26vw, 24rem)` (5.5rem phones), LTR. Two layers: an outline
  (1.5px `brass` stroke at 55%) and a solid `brass` copy on top revealed with `clip-path`.
- Text: eyebrow "ותק", H2, body in `on-dark-soft` max 30em.

## Motion (signature)
The solid numeral fills from bottom to top as the section scrolls: fill = clamp((progress - .18) / .5).
Heading mask-reveal, body rise.

## Fallbacks
Reduced motion / "stop animations": numeral fully filled.

## Accessibility
The numeral is decorative (`aria-hidden`); the H2 carries the fact in words.

## Implementation (built)
- `src/components/sections/Years.tsx`; numeral layers `years-outline` / `years-fill` in globals.css.
- **Fill window changed to meet the criterion below:** `remap(progress, .18, .32)` on the section's viewport progress,
  i.e. full at progress .5 (section centre at viewport centre). The original `(progress - .18) / .5` only reaches
  64% fill at that point.
- Heading uses `SectionHeading` with `by="word"` and the `type-h2-years` size (prototype values, added to tokens.md).
- Clip exists only under `html.motion`; reduced motion, stop animations, no JS and the no-hydration failsafe all show
  the numeral filled.

## Acceptance criteria
- [ ] Numeral fully filled by the time the section center passes the viewport center.
- [ ] No invented claims in the body copy (years, city, courts only).
- [x] Education moved to the About facts (prototype, 2026-10-04); the body carries the licensing years.
