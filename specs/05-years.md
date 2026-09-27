# 05 30 years

## Purpose
Make the one hard number the office has (30 years) physical and memorable.

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

## Acceptance criteria
- [ ] Numeral fully filled by the time the section center passes the viewport center.
- [ ] No invented claims in the body copy (years, city, courts only).
- [ ] Education line renders only when `office.education` exists.
