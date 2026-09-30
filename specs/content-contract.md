# Content contract

All office data and site copy live in one typed module under `/content`, validated with Zod at build time.
Components read from it and never hold their own copy (CLAUDE.md golden rules 2 and 7).
A build fails if a required field is missing or malformed.

## Schema

```ts
// content/schema.ts
const Office = z.object({
  name: z.string(),                    // "עו״ד יוסי שוקרון כהן" (must match Google + Golden Pages)
  shortName: z.string(),               // "יוסי שוקרון כהן"
  monogram: z.string(),                // "ש״כ"
  title: z.string(),                   // "עורך דין ונוטריון"
  city: z.string(),                    // "חדרה"
  address: z.string(),                 // "הרברט סמואל 27"
  phoneDisplay: z.string(),            // "052-252-1127"
  phoneE164: z.string().regex(/^\+9725\d{8}$/),   // "+972522521127"
  whatsappE164: z.string().regex(/^9725\d{8}$/),  // "972522521127" (wa.me format, no plus)
  email: z.string().email(),
  yearsOfPractice: z.number().int().positive(),   // 30
  hours: z.string().optional(),                   // OPEN
  accessAndParking: z.string().optional(),        // OPEN
  education: z.string().optional(),               // OPEN
  wazeUrl: z.string().url(),
  mapsUrl: z.string().url(),
});

const PracticeArea = z.object({
  id: z.enum(["family", "torts", "real-estate", "notary"]),
  tabLabel: z.string(),                // folder tab text
  headline: z.string(),
  lead: z.string(),
  services: z.array(z.string()).min(3).max(6),    // OPEN: confirm with Yossi
  whatsappTopic: z.string(),           // inserted into the pre-filled WhatsApp message
  ctaLabel: z.string(),
});

const ProcessStep = z.object({ title: z.string(), body: z.string() });

const Review = z.object({
  quote: z.string().min(40),
  clientName: z.string(),              // as the client agreed to be named
  area: PracticeArea.shape.id,
  consentConfirmed: z.literal(true),   // no consent, no publish
});

const Faq = z.object({ question: z.string(), answer: z.string() });

const Site = z.object({
  office: Office,
  hero: z.object({ line1: z.string(), line2: z.string(), sub: z.string() }),
  statement: z.object({ text: z.string(), highlight: z.string(), footLabel: z.string(), footText: z.string() }),
  years: z.object({ heading: z.string(), body: z.string() }),
  practiceAreas: z.array(PracticeArea).length(4),
  process: z.array(ProcessStep).length(3),
  about: z.object({ paragraphs: z.array(z.string()).min(1) }),
  // reviews are not in this file: they come from the database (approved only), see specs 18 and 19
  faq: z.array(Faq).min(3),
  finalCta: z.object({ line1: z.string(), line2: z.string(), body: z.string() }),
  legal: z.object({ disclaimer: z.string(), accessibilityStatementPath: z.string(), privacyPath: z.string() }),
});
```

## Derived values (pure helpers in `/src/lib`, unit-tested)

| Helper | Output |
|---|---|
| `waLink(topic?)` | `https://wa.me/{whatsappE164}?text=` + encoded `שלום עו״ד שוקרון כהן, אשמח להתייעץ[ בנושא {topic}].` |
| `telLink()` | `tel:{phoneE164}` |
| `wazeLink()` / `mapsLink()` | From `office`, with the address URL-encoded |

## Rules for copy
- No em-dashes. No emojis. No promised outcomes (Israel Bar advertising rules).
- No invented facts. Unknown values stay optional and the UI omits them; they never render as brackets in production.
- Reviews require `consentConfirmed: true`.

## Open items to collect from Yossi

| Field | Status |
|---|---|
| `practiceAreas[].services` | Draft exists, needs confirmation |
| `hours`, `accessAndParking` | Missing |
| `education` | Missing |
| `about.paragraphs` (personal paragraph) | Missing |
| `faq[].answer` for cost, what to bring, notary without a case, clients outside Hadera | Missing |
| `reviews` | None yet; owner curates with client consent |
| Voice (first vs. third person) | Prototype uses neutral / third person |
| High-resolution portrait, real signature, office photos | Missing |
