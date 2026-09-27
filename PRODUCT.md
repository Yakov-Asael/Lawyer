# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js (App Router) + TypeScript strict + Tailwind CSS + shadcn/ui, `lucide-react` icons, pnpm, deployed on Vercel.
Chosen by the owner. Full rules in `CLAUDE.md`.

## Users
Private individuals in the Hadera area facing a personal legal matter: a divorce or custody dispute, an accident or
insurance claim, a property deal, or a document that needs a notary. Most arrive stressed or uncertain, often on a
phone, after a Google search or a referral. Their job on the page: decide within seconds that this lawyer is
trustworthy and relevant to their problem, then reach him directly.

## Product Purpose
A single-page site for the law office of עו״ד יוסי שוקרון כהן, lawyer and notary in Hadera. It exists to turn a
visitor into a conversation. Success is a WhatsApp chat or a phone call started. There is no form, booking or
payment flow in v1.

## Positioning
Two facts no neighboring office can copy:
1. **Personal handling.** The client works with Yossi himself, not with an associate or intern.
2. **30 years in Hadera.** Three decades of practice in the city and its courts.

Secondary fact: legal representation and notary services under one roof.

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
- Experience: 30 years

**Practice areas (four, in this order):**
1. דיני משפחה ומעמד אישי
2. נזיקין וביטוח
3. מקרקעין, נדל"ן וחוזים
4. נוטריון

**Constraints:**
- Hebrew only, RTL.
- Must comply with the Israel Bar Association advertising rules: no promised outcomes, no misleading or comparative
  claims. Copy that may cross the line is flagged for review, not published.

**Open decisions (do not invent):**
- Office hours.
- Sub-services under each practice area (a first draft exists in the mockup; needs Yossi's confirmation).
- Voice: first person ("אני מלווה") or third person ("עו״ד שוקרון כהן מלווה").
- Logo / wordmark: none exists; to be designed.
- Education, admission year, memberships.
- Domain name.

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
2. **Trust through verifiable truth.** Only facts that can be backed up: 30 years, the address, the credentials.
   Restraint reads as confidence; inflated claims read as a sales pitch and may breach Bar rules.
3. **Personal, not corporate.** The page is about a person the client will actually meet, not a faceless firm.
4. **Calm for people under stress.** Plain Hebrew, no legalese, short sections, obvious next step.
5. **Rooted in Hadera.** Local presence is part of the value, not a footnote.

## Accessibility & Inclusion
- Israeli accessibility regulations: IS 5568 (WCAG 2.0 AA) as the floor.
- An accessibility statement (הצהרת נגישות) with a named contact is required at launch.
- Audience skews older and mobile: large tap targets, readable body size, strong contrast.
