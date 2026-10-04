# 17 Terms of use (תקנון האתר)

## Purpose
Define the terms for using the site, and above all make clear that reading the site or sending a WhatsApp message
does not create an attorney-client relationship and is not legal advice.

## Route and layout
- Route: `/terms` ("תקנון האתר"). Shares one legal-page template with `/accessibility` and `/privacy` (spec 16).
- Template: slim header (brand + back link "חזרה לאתר" + ContactButtons), page title, "עודכן לאחרונה: {date}",
  a sticky table of contents on desktop (collapsible list on phones), readable column max 70ch, footer.
- Numbered sections (the numbering is real: legal documents are cited by clause number).
- Same tokens, typography and accessibility menu as the main page. No scroll animations on legal pages.

## Content outline (draft structure; final wording by Yossi)
1. כללי: who operates the site (office name, address, contact); use of the site means acceptance of the terms;
   the terms apply to all genders equally.
2. אין ייעוץ משפטי: site content is general information only and is not legal advice or a substitute for it.
3. אין יחסי עורך דין ולקוח: browsing, a WhatsApp message or a call does not create an attorney-client relationship;
   that relationship starts only with an engagement agreed with the office.
4. דיוק המידע: content may change; the office is not liable for decisions made based on it.
5. המלצות: published with the client's consent; reflect personal experience and do not promise any result.
6. קניין רוחני: content, design, logo and photos belong to the office; no copying without written permission.
7. קישורים לשירותים חיצוניים: WhatsApp, Waze, Google Maps and other third-party services are governed by their own terms.
8. פרטיות: pointer to `/privacy`.
9. נגישות: pointer to `/accessibility`.
10. הגבלת אחריות: availability of the site, errors, service interruptions.
11. שינויים בתקנון: the office may update the terms; the date at the top shows the current version.
12. דין וסמכות שיפוט: Israeli law; jurisdiction **[to be set by Yossi]**.
13. יצירת קשר: phone, email, address from the content contract.

## Content contract addition
```ts
const LegalPage = z.object({
  slug: z.enum(["terms", "privacy", "accessibility"]),
  title: z.string(),
  updatedAt: z.string(),                 // ISO date, shown as dd.mm.yyyy
  sections: z.array(z.object({ heading: z.string(), body: z.array(z.string()).min(1) })).min(1),
});
```
Texts live in `/content/legal/*.ts`, not in components.

## Rules
- We provide the structure and a draft. Yossi, as the lawyer, approves every word before launch.
- No em-dashes, plain Hebrew, short clauses.
- Linked from the footer ("תקנון האתר") and from the accessibility menu footer.

## Acceptance criteria
- [x] `/terms` renders from content, with an "updated" date and working in-page anchors for every clause.
- [x] Clauses 2 and 3 (no advice, no attorney-client relationship) are present and visible without expanding anything.
- [x] Footer and accessibility menu link to `/terms`; the page passes the same accessibility checks as the home page.
- [x] Jurisdiction clause is filled before launch (build fails on the placeholder).

## Implementation (built)
- Route `/terms` in `src/app/(legal)/terms`, rendered by the shared `LegalDocument` template from spec 16
  (title card, updated date, sticky TOC on desktop / `<details>` on phones, numbered clauses with `#clause-N`
  anchors, contact card). Paths stay as in content: `/accessibility-statement`, `/privacy-policy`, `/terms`.
- Content in `content/legal/terms.ts`: the 13 clauses of the outline. Clauses 8 and 9 point to the privacy policy
  and the accessibility statement through a new optional `links` field on `LegalSection` (internal paths only).
- Clause 12 (jurisdiction) carries a placeholder, so a production build fails until Yossi sets it; the page is also
  `approved: false` like the other drafts.
- Accessibility menu footer: reset on its own line, then the three legal links under a hairline.
- Tests: unit (jurisdiction blocks production, clause order) and e2e (clauses 2 and 3 visible without expanding,
  13 anchors, links to privacy and accessibility, the shared contrast, console, TOC and contact checks).
