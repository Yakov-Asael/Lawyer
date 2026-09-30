# 20 Press and cases page (phase 2, not in the first build)

## Purpose
Build trust with verifiable external evidence: articles written about Yossi and notable cases he handled.

## Route and entry
`/press` ("בתקשורת ובבתי המשפט"). Linked from the About section ("כתבו עליו") and the footer once it has content.
Hidden entirely while empty.

## Content types (managed in the admin, spec 19)
| Type | Fields |
|---|---|
| כתבה | Title, outlet, date, link, short excerpt (own words), optional image with rights |
| תיק / פסק דין | Title, court, year, practice area, short neutral summary, optional link to a public ruling |

## Legal and ethical rules (must be approved by Yossi)
- Cases are shown only with the client's written consent or when fully anonymized; no client names or identifying
  details.
- Summaries describe the matter, not a promised or typical outcome (Israel Bar advertising rules).
- Only public rulings are linked; no sealed or family-court details (family matters are generally closed-door).
- Articles: link to the source, quote briefly, no copying of full text or images without permission.

## Layout (to be designed as a mockup before build)
Filter chips by type and area, a list of cards sorted by date, each opening the external link in a new tab.

## Acceptance criteria (phase 2)
- [ ] Page renders from admin content and is hidden when empty.
- [ ] Every case item passes a checklist in the admin (consent or anonymized) before it can be published.
- [ ] Structured data: `NewsArticle` references for press items only.
