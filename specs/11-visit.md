# 11 Visit

## Purpose
Everything needed to arrive: where, when, parking and accessibility, and one-tap navigation.

## Content
`office.address`, `office.city`, `office.accessAndParking` (optional), `office.hours` (optional), Waze and Maps URLs.

## Layout
- Rounded `bark` card, max 1180px. ≥900px: two columns `.9fr / 1.1fr`, text at start, map at end. Phones: text, then map.
- Text: eyebrow "הגעה למשרד", H2 "איפה אנחנו", address in serif 700, description and hours in `muted`,
  WhatsApp button (`ink`, "לתיאום פגישה בוואטסאפ"), and below it a row of two 44px round icon links: Waze, Google Maps.
- Map: `radius-lg`, 16:11, clean (no overlay card, no text), centered pin in `brass-deep`.

## Map (decision pending, see PRODUCT.md)
- Target: live Google Maps embed (iframe) of the office, lazy-loaded when the section nears the viewport.
- Requires the privacy notice (Maps sets cookies). Until the notice exists, render the static styled map with the pin
  (as in the prototype), linking to Google Maps.

## Accessibility
Icon links: `aria-label` "ניווט למשרד ב-Waze" / "המשרד ב-Google Maps". Map iframe gets a `title`; the static map is
`role="img"` with an `aria-label`.

## Acceptance criteria
- [ ] Waze and Maps links open the office address in a new tab/app.
- [ ] Hours and access line render only when present in content.
- [ ] Nothing overlays the map.
- [ ] The iframe (when enabled) does not load before the section is near the viewport.
