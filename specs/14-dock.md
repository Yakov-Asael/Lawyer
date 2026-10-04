# 14 Mobile contact dock

## Purpose
Keep the two conversion actions one tap away on phones, after the visitor has left the hero.

## Layout
- <900px only. Fixed to the bottom, full width, `ink` at 94% with backdrop blur,
  padding `10px 12px` + bottom safe-area inset.
- Two columns `1.3fr / 1fr`: "וואטסאפ" (`brass`) and "חיוג" (`ghost`), 50px high.

## Behavior
- Hidden (translated below the screen) while the hero is in view; slides in once the hero's bottom passes 40% of the
  viewport; slides out again when scrolling back to the hero.
- Not shown while the mobile menu is open (the menu covers it).

## Implementation (built)
- `src/components/dock/ContactDock.tsx` (client), rendered in the root layout. Visibility from `dockVisible()`
  (`src/lib/dock.ts`, tested) on the shared frame loop, measured only when the page scrolls or resizes. Pages without
  a hero (legal pages) show it always.
- While hidden the dock is `inert`, so keyboard and screen-reader users never reach off-screen buttons. The open
  mobile menu covers it (higher layer) and makes it inert too.
- Call button shows "חיוג" with the accessible name "חיוג ל-052-252-1127" (label in name).
- Space reserved by the footer (`dock-clearance`), not by `<main>`.

## Acceptance criteria
- [ ] Not visible on first load at 390x844; visible after scrolling past the hero.
- [ ] Never covers the last lines of the footer (main reserves the space).
- [ ] Tap targets ≥48px; labels readable at 200% text size.
