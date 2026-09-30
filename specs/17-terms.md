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
- [ ] `/terms` renders from content, with an "updated" date and working in-page anchors for every clause.
- [ ] Clauses 2 and 3 (no advice, no attorney-client relationship) are present and visible without expanding anything.
- [ ] Footer and accessibility menu link to `/terms`; the page passes the same accessibility checks as the home page.
- [ ] Jurisdiction clause is filled before launch (build fails on the placeholder).
