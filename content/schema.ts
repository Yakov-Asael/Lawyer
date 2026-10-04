import { z } from "zod";

/**
 * Content contract (specs/content-contract.md).
 * Every piece of office data and site copy is validated here at build time.
 */

/** Marker for copy that is still missing from the client. Never shipped to production. */
export const PLACEHOLDER_PATTERN = /\[placeholder[^\]]*\]/;

/** Copy rules from CLAUDE.md: no em-dashes, no emojis in site copy. */
const EM_DASH = /—/;
const EMOJI = /\p{Extended_Pictographic}/u;

const copy = z
  .string()
  .trim()
  .min(1)
  .refine((s) => !EM_DASH.test(s), "No em-dashes in site copy")
  .refine((s) => !EMOJI.test(s), "No emojis in site copy");

export const Office = z.object({
  name: copy,
  shortName: copy,
  monogram: copy,
  title: copy,
  city: copy,
  address: copy,
  phoneDisplay: z.string().regex(/^05\d-\d{3}-\d{4}$/),
  phoneE164: z.string().regex(/^\+9725\d{8}$/),
  whatsappE164: z.string().regex(/^9725\d{8}$/),
  email: z.email(),
  yearsOfPractice: z.number().int().positive(),
  /** Years of admission, as confirmed by Yossi (lawyer, notary). */
  licensed: z.object({ lawyer: z.number().int().min(1950), notary: z.number().int().min(1950) }),
  hours: copy.optional(),
  accessAndParking: copy.optional(),
  education: copy.optional(),
});

export const PracticeAreaId = z.enum(["family", "real-estate", "torts", "civil", "notary"]);

export const PracticeArea = z.object({
  id: PracticeAreaId,
  tabLabel: copy,
  headline: copy,
  lead: copy,
  services: z.array(copy).min(3).max(6),
  whatsappTopic: copy,
  ctaLabel: copy,
});

export const ProcessStep = z.object({ title: copy, body: copy });

export const Review = z.object({
  quote: copy.pipe(z.string().min(40)),
  clientName: copy,
  area: PracticeAreaId,
  consentConfirmed: z.literal(true),
});

export const Faq = z.object({ question: copy, answer: copy });

/** Pre-filled WhatsApp messages. `{topic}` is replaced with a practice area's whatsappTopic. */
export const WhatsappCopy = z.object({
  message: copy,
  topicMessage: copy.refine((s) => s.includes("{topic}"), "topicMessage must contain {topic}"),
});

export const Site = z
  .object({
    office: Office,
    whatsapp: WhatsappCopy,
    /** Interface strings that belong to no single section. */
    ui: z.object({
      skipLink: copy,
      whatsappCta: copy,
      /** Accessible name of the icon-only call button. `{phone}` is replaced with office.phoneDisplay. */
      callLabel: copy.refine((s) => s.includes("{phone}"), "callLabel must contain {phone}"),
      wazeLabel: copy,
      mapsLabel: copy,
    }),
    /** Seal brand mark (spec 01): ring text around the monogram, and the word under it. */
    brand: z.object({ sealRing: copy, sealSub: copy }),
    hero: z.object({ line1: copy, line2: copy, sub: copy }),
    statement: z.object({ text: copy, highlight: copy, footLabel: copy, footText: copy }),
    years: z.object({ eyebrow: copy, heading: copy, body: copy }),
    practiceAreas: z.array(PracticeArea).length(5),
    process: z.array(ProcessStep).length(3),
    about: z.object({ paragraphs: z.array(copy).min(1) }),
    // Reviews are not in this file: approved reviews come from the database (specs 18, 19).
    faq: z.array(Faq).min(3),
    finalCta: z.object({ line1: copy, line2: copy, body: copy }),
    legal: z.object({
      disclaimer: copy,
      accessibilityStatementPath: z.string().startsWith("/"),
      privacyPath: z.string().startsWith("/"),
    }),
  })
  .refine((s) => s.statement.text.includes(s.statement.highlight), {
    message: "statement.highlight must appear verbatim in statement.text",
    path: ["statement", "highlight"],
  })
  .refine(
    (s) =>
      s.practiceAreas.map((a) => a.id).join() === PracticeAreaId.options.join(),
    { message: "practiceAreas must be family, real-estate, torts, civil, notary in that order", path: ["practiceAreas"] },
  );

export type Office = z.infer<typeof Office>;
export type PracticeArea = z.infer<typeof PracticeArea>;
export type PracticeAreaId = z.infer<typeof PracticeAreaId>;
export type ProcessStep = z.infer<typeof ProcessStep>;
export type Review = z.infer<typeof Review>;
export type Faq = z.infer<typeof Faq>;
export type WhatsappCopy = z.infer<typeof WhatsappCopy>;
export type Site = z.infer<typeof Site>;
