# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js (App Router) + TypeScript strict + Tailwind CSS + shadcn/ui, `lucide-react` icons, pnpm, deployed on Netlify (free plan).
Chosen by the owner. Full rules in `CLAUDE.md`.

## Users
Private individuals in the Hadera area facing a personal legal matter: a divorce or custody dispute, an accident or
insurance claim, a property deal, or a document that needs a notary. Most arrive stressed or uncertain, often on a
phone, after a Google search or a referral. Their job on the page: decide within seconds that this lawyer is
trustworthy and relevant to their problem, then reach him directly.

## Product Purpose
A site for the law office of עו״ד יוסי שוקרון כהן, lawyer and notary in Hadera. It exists to turn a
visitor into a conversation. Success is a WhatsApp chat or a phone call started. There is no booking or payment flow. The only form collects
testimonials, which Yossi approves in a private panel before anything is published.

## Positioning
Two facts no neighboring office can copy:
1. **Personal handling.** The client works with Yossi himself, not with an associate or intern.
2. **23 years of practice** (confirmed by Yossi, 2026-10-04), plus inside knowledge of insurers as a former insurance agent.

Secondary facts: legal representation and notary services under one roof; mediation and negotiated settlement before litigation.

## Operating Context
- Visitors arrive from Google search, Google Maps, Golden Pages (d.co.il) and word of mouth.
- The office currently has **no Google Business Profile**. Setting one up is a parallel workstream
  (`docs/google-business-profile.md`). Name, address and phone must be identical on the site, Google and Golden Pages.
- Contact happens by WhatsApp or phone to the same number; email is secondary.

## Capabilities and Constraints
**Confirmed business facts (NAP, must match everywhere):**
- Name: עו״ד יוסי שוקרון כהן
- Address: הרברט סמואל 27, חדרה
- Phone and WhatsApp: 052-252-1127
- Email: shukruny@smile.net.il
- Experience: 23 years
- Background: former insurance agent (Yossi's own statement)
- Source copy from Yossi: `content/source/yossi-2026-10-04.md`

**Practice areas (five, in this order; confirmed 2026-10-04):**
1. דיני משפחה וירושה
2. מקרקעין ונדל״ן (including planning and building)
3. נזיקין וביטוח
4. משפט אזרחי ומסחרי (contracts, litigation, mediation)
5. נוטריון (including enduring power of attorney)

**Constraints:**
- Hebrew only, RTL.
- Must comply with the Israel Bar Association advertising rules: no promised outcomes, no misleading or comparative
  claims. Copy that may cross the line is flagged for review, not published.

**Open decisions (do not invent):**
- Office hours.
- Notary sub-services beyond enduring power of attorney (draft list in the mockup; needs Yossi's confirmation).
- Voice: About is first person (Yossi's own text); the rest stays neutral / third person. Confirm with Yakov.
- Logo / wordmark: none exists; to be designed.
- Education, admission year, memberships.
- Domain name.
- Google Maps embed in the visit section: planned for later; needs the privacy notice (Maps sets cookies).

## Brand Commitments
- No existing brand. The owner's emotional brief for the palette: seriousness, warmth, care.
- The owner wants high-end, scroll-driven motion as part of the experience.
- Visual details belong in the direction contract and DESIGN.md, not here.
- No emojis. No em-dashes in site copy.

## Evidence on Hand
- Professional portrait: `design/assets/yossi-shukrun-cohen-portrait.webp` (about 776x658, 43KB). Usable for the
  mockup; a higher-resolution original is needed for production.
- Reference of practice areas from an existing listing: `design/assets/ref-practice-areas-screenshot.png`.
- Existing Golden Pages listing under the same name and address.
- **Testimonials policy (owner decision):** in phase one, testimonials are curated by the owner and published on the
  site itself, with each client's consent. Not pulled from Google.
- **No testimonials, no case results, no press coverage, no ratings, no case counts yet.** A web search found only the
  Golden Pages listing. None of these may be fabricated. Sections that need them stay out until real material exists.

## Product Principles
1. **One tap to Yossi.** Every screen, on every device, offers WhatsApp and a call without scrolling.
2. **Trust through verifiable truth.** Only facts that can be backed up: 23 years, the address, the credentials.
   Restraint reads as confidence; inflated claims read as a sales pitch and may breach Bar rules.
3. **Personal, not corporate.** The page is about a person the client will actually meet, not a faceless firm.
4. **Calm for people under stress.** Plain Hebrew, no legalese, short sections, obvious next step.
5. **Rooted in Hadera.** Local presence is part of the value, not a footnote.

## Accessibility & Inclusion
- Israeli accessibility regulations: IS 5568 (WCAG 2.0 AA) as the floor.
- An accessibility statement (הצהרת נגישות) with a named contact is required at launch.
- Audience skews older and mobile: large tap targets, readable body size, strong contrast.
