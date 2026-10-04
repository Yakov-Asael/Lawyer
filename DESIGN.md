---
name: עו״ד יוסי שוקרון כהן
description: A personal lawyer and notary in Hadera, one tap away. Hebrew, RTL, cleangold.
colors:
  ink: "#14233A"
  field: "#1F3452"
  brass: "#CDAE6A"
  brass-deep: "#7A5B18"
  stone: "#F8F7F4"
  paper: "#FFFFFF"
  bark: "#E6E3DC"
  muted: "#55565C"
  danger: "#A3332B"
typography:
  display:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "clamp(2.9rem, 7.2vw, 7.4rem)"
    fontWeight: 700
    lineHeight: 0.98
  headline:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "clamp(2.2rem, 4.4vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
  title:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "clamp(1.4rem, 2vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Assistant, Heebo, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Assistant, Heebo, Arial, sans-serif"
    fontSize: "14.5px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "12px"
  md: "18px"
  lg: "28px"
  pill: "999px"
spacing:
  inset: "10px"
  gutter: "clamp(20px, 4.2vw, 64px)"
  section: "clamp(70px, 9vw, 130px)"
  content: "1180px"
components:
  button-primary-dark:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "52px"
    padding: "0 26px"
  button-primary-light:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stone}"
    rounded: "{rounded.pill}"
    height: "52px"
    padding: "0 26px"
  button-primary-light-hover:
    backgroundColor: "{colors.field}"
  button-line:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "52px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
  section-card-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stone}"
    rounded: "{rounded.lg}"
---

# Design System: עו״ד יוסי שוקרון כהן

## Overview

**Creative North Star: "The Notary's Desk"**

A personal lawyer, not a firm. The site refuses the category default of courthouse stock photos, scales of justice and a templated corporate grid. Seriousness comes from deep navy grounds and a serif that reads like a signed document; warmth comes from gold used sparingly, like brass on a desk; care comes from clean white paper and generous space. The hand-made details carry the identity: a notary seal as the brand mark, ruled legal-pad hairlines on dark fields, court-file folders with tabs, a signature that draws itself.

The audience arrives stressed, mostly on a phone, often older. Every surface is built so a visitor trusts the office in seconds and reaches it in one tap: WhatsApp and call are always within reach, text is large and high-contrast, and motion explains the story without ever blocking it. Hebrew and RTL are native, not translated.

**Key Characteristics:**
- Inset rounded section cards on a stone page, alternating navy and paper grounds.
- Frank Ruhl Libre headlines at display scale, Assistant for everything you read or tap.
- Gold as an accent and as the primary button on dark grounds, never as text on light.
- Scroll-told motion with one signature moment per section, always with a still fallback.
- WhatsApp first, phone second, everywhere.

## Colors

Navy and gold on clean white: the owner's final palette, "cleangold".

### Primary
- **Notary Ink** (#14233A): dark section grounds (hero, final CTA, legal title cards), primary text on light, the primary button on light grounds.
- **Committed Navy** (#1F3452): the second dark ground (years, reviews), the hover of ink buttons.

### Secondary
- **Desk Brass** (#CDAE6A): accent on dark grounds, the primary button on dark grounds, seal rings, list dots.
- **Deep Brass** (#7A5B18): accent text on light grounds (eyebrows, clause numbers, link hovers) and the focus ring on light grounds.

### Neutral
- **Stone** (#F8F7F4): the page ground and text on dark grounds.
- **Paper** (#FFFFFF): raised surfaces (cards, panels, the review dialog, form controls).
- **Bark** (#E6E3DC): hairlines and secondary surfaces on light.
- **Muted** (#55565C): secondary text on light (6.8:1 on stone).
- **Danger** (#A3332B): form errors only, text and invalid borders (6.8:1 on paper).

### Named Rules
**The Brass Is Not Text Rule.** `brass` never colours text on a light ground; use `brass-deep`. On dark grounds `brass` is the accent and focus colour.

**The Tokens Only Rule.** Components never hold a raw hex; every colour is a CSS variable on `:root`, so the high-contrast mode can re-derive the palette in one place.

## Typography

**Display Font:** Frank Ruhl Libre (with David Libre, Times New Roman)
**Body Font:** Assistant (with Heebo, Arial)

**Character:** a bookish Hebrew serif with real weight for headings, paired with a calm, open sans that stays legible at small sizes on a phone.

### Hierarchy
- **Display** (700, `clamp(2.9rem, 7.2vw, 7.4rem)`, 0.98; 2rem on phones): the hero headline only.
- **Headline** (700, `clamp(2.2rem, 4.4vw, 4rem)`, 1.05; 1.55rem on phones): section headings, legal page titles.
- **Title** (700, `clamp(1.4rem, 2vw, 1.75rem)`, 1.2): step and clause headings, dialog titles.
- **Body** (400, 17px, 1.65; 15–16px on phones): paragraphs, max 70ch on legal pages.
- **Label** (600, 14.5px): form labels; eyebrows are 13px, 600, tracking .14em.

### Named Rules
**The Isolated Number Rule.** Numbers inside Hebrew text (phone, years, counters) sit in an isolated LTR run with tabular figures (`.num`), so they never reorder.

## Layout

A 10px inset page frame holds rounded section cards; content sits in a 1180px column with a fluid gutter (`clamp(20px, 4.2vw, 64px)`) and section padding of `clamp(70px, 9vw, 130px)`. Breakpoints: phone up to 600px (type scale), layouts stack below 900px (where the contact dock appears), the header nav from 1000px. Logical properties only (`ms-`, `pe-`, `start`, `end`), so RTL is the native direction and nothing is mirrored by hand. Legal pages use a sticky table of contents beside a 70ch reading column.

## Elevation & Depth

Mostly flat, layered by ground colour: navy cards against a stone page do the depth work. Shadows are soft, long and ink-tinted, and only lift things that are physically "on the desk".

### Shadow Vocabulary
- **Seal** (`0 12px 30px -10px rgb(0 0 0 / .6)`): the notary seal over the portrait.
- **File** (`0 -1px 0 rgb(0 0 0 / .04), 0 24px 50px -30px` ink 45%): files, legal cards, the review page card.
- **Panel** (`0 30px 70px -20px` ink 55%): the accessibility panel.
- **Sheet** (`0 -20px 60px -20px` ink 50%): the review dialog.

## Shapes

Generous, soft corners: 28px section cards, 18px inner cards, 12px controls, pill buttons. Circles are reserved for the seal, round icon buttons and the success mark. Hairlines are 1px bark on light and 14% stone on dark; the ruled legal-pad texture is a 44px repeating hairline with one brass margin rule.

## Components

### Buttons
- **Shape:** pill (999px), 52px tall (44px compact), 1.5px border slot.
- **Primary:** brass on dark grounds, ink on light; label 16px/700.
- **Hover / Focus:** lift 2px over 350ms; ink turns committed navy; the focus ring is 2px brass-deep (brass on dark) with a 3px offset.
- **Secondary:** ghost (stone outline) on dark, line (ink outline, fills ink on hover) on light. Icon-only buttons are round and always carry an accessible name.

### Cards / Containers
- **Corner Style:** 28px for sections, 18px inside.
- **Background:** ink or committed navy (with the ruled texture) for statements; paper for content cards.
- **Shadow Strategy:** File shadow for paper cards on stone; none on dark sections.
- **Internal Padding:** the gutter horizontally, section padding vertically.

### Inputs / Fields
- **Style:** paper ground, 1.5px control-edge border (ink 38%), 12px radius, 16px text (no zoom on iOS).
- **Focus:** the site focus ring; the border darkens to ink on hover.
- **Error:** danger border plus the error in words under the field, linked with `aria-describedby`.

### Navigation
- **Header:** sits over the hero (or the legal title card), not sticky; links on-dark-soft turning stone on hover, 44px targets; a full-screen menu below 1000px.
- **Contact dock:** the sticky WhatsApp and call bar on phones, shown after the hero and hidden while a text field has focus.

### Notary Seal (signature)
Ink disc with brass rings, ring text and the monogram; it turns with scroll in the hero and stamps down once in the final CTA (`ease-stamp`, a deliberate overshoot). A line version marks the footer and the legal pages.

## Do's and Don'ts

### Do:
- **Do** put WhatsApp first and the phone second in every contact pair; the number is the call button's accessible name, not its label.
- **Do** give every motion a still fallback under `prefers-reduced-motion` and the "stop animations" option.
- **Do** keep copy in `/content`, and read it in client code from `@content/data` (never `@content`, which ships the validator).
- **Do** use `[placeholder: ...]` for anything the client has not confirmed; production builds fail on it.

### Don't:
- **Don't** use stock courthouse imagery, scales of justice or a templated corporate grid.
- **Don't** use emoji or em-dashes in site copy.
- **Don't** set `brass` text on light grounds, or a raw hex inside a component.
- **Don't** promise outcomes, show ratings, or invent stats or testimonials (Israel Bar advertising rules).
