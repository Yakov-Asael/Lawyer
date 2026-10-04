# 08 About

## Purpose
Introduce the person the client will meet, with verifiable facts only.

## Content
Portrait (second crop), `office.name`, `about.paragraphs`, facts: years, "עורך דין ונוטריון", city, education
(optional). No signature (owner decision, 2026-10-04).

## Layout
- On `stone`. ≥900px: two columns `.85fr / 1.15fr`, photo at start. Phones: photo first, then text.
- Photo: `radius-lg`, 4:5, max 460px, inner parallax 7%. **Needs a different photo** than the hero (office or at work).
- H2 is the name on two lines. Paragraphs in `muted` 18px (15px phones), max 32em.
- Facts: `<dl>` in a two-column grid with hairlines; labels 13px `muted`, values serif 21px (16px phones).

## Motion
Photo parallax, heading mask reveal, paragraphs rise.

## Rules
- Facts render only when present in content; no placeholders in production.

## Acceptance criteria
- [ ] No fact appears that is not in `PRODUCT.md` / content.
- [ ] Photo has an empty alt if it repeats the hero person, or a descriptive alt if it shows the office.
