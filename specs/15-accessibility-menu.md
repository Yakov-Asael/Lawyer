# 15 Accessibility menu

## Purpose
A visitor-facing tool to adjust the page. Built in-house, matching the brand. It is a convenience layer:
IS 5568 compliance is achieved in the code itself, not by this menu.

## Layout
- Floating 52px round button, `brass` with a 2px `ink` border, accessibility figure icon.
  Position: inline-start (right). Phones: above the dock (`bottom: 86px + safe-area`). Desktop: `24px / 24px`.
- Panel above the button: `paper`, 22px radius, max width 340px, scrollable if short screen.
  Header "נגישות" + close. Text size row (− / value / +). A 2x3 grid of toggle tiles. Footer: "איפוס הגדרות" and a link
  to the accessibility statement.

## Options (each is a class on `<html>`)
| Option | Effect |
|---|---|
| Text size | 100 / 110 / 120 / 135% zoom on the main content |
| ניגודיות גבוהה | High-contrast token overrides (see tokens) |
| גווני אפור | `grayscale(1)` on page content |
| הדגשת קישורים | Underline every link |
| גופן קריא | Headings switch to the sans font, wider letter and word spacing |
| עצירת אנימציות | Same as reduced motion: no loader, no reveals, no scrubbing, no smooth scroll |
| סמן גדול | Large high-contrast cursor |

## Behavior
- Choices persist in `localStorage` (`shc-a11y`), read before first paint to avoid a flash.
- Opening moves focus to the close button; Esc, the close button or a click outside closes and returns focus.
- Tiles are toggle buttons with `aria-pressed`. Size value announced via `aria-live`.
- "Stop animations" must also remove the intro loader (regression found in prototype testing).

## Acceptance criteria
- [ ] Every option visibly changes the page and survives a reload.
- [ ] Reset returns to defaults and clears storage.
- [ ] Fully operable by keyboard; focus never lost.
- [ ] With "stop animations" on, a fresh load shows content immediately, no curtain.
