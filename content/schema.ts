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
  hours: copy.optional(),
  accessAndParking: copy.optional(),
  education: copy.optional(),
});

export const PracticeAreaId = z.enum(["family", "torts", "real-estate", "notary"]);

export const PracticeArea = z.object({
  id: PracticeAreaId,
  tabLabel: copy,
  headline: copy,
  lead: copy,
  services: z.array(copy).min(3).max(6),
  whatsappTopic: copy,
  ctaLabel: copy,
  /** Shown under the service list while it is unconfirmed; a "[placeholder...]" note blocks production. */
  servicesNote: copy.optional(),
});

export const ProcessStep = z.object({ title: copy, body: copy });

export const Review = z.object({
  quote: copy.pipe(z.string().min(40)),
  clientName: copy,
  area: PracticeAreaId,
  consentConfirmed: z.literal(true),
});

/** In-page navigation target: "#" + a section id. */
export const NavLink = z.object({ label: copy, href: z.string().regex(/^#[a-z][a-z-]*$/) });

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
      /** Short WhatsApp label for the compact header button. */
      whatsappShort: copy,
      /** Visible text of full-width call buttons (menu footer, dock). */
      callShort: copy,
      navLabel: copy,
      /** Accessible name of the phone contact dock (spec 14). */
      dockLabel: copy,
      menuLabel: copy,
      openMenu: copy,
      closeMenu: copy,
    }),
    /** Seal brand mark (spec 01): ring text around the monogram, and the word under it. */
    brand: z.object({ sealRing: copy, sealSub: copy }),
    /** Header nav (desktop) and the fuller mobile menu (spec 02). */
    navigation: z.object({ header: z.array(NavLink).min(1), menu: z.array(NavLink).min(1) }),
    hero: z.object({
      line1: copy,
      line2: copy,
      sub: copy,
      /** The personal-handling sentence inside `sub`, set in on-dark 600 (spec 03). */
      subEmphasis: copy,
      portraitAlt: copy,
    }),
    statement: z.object({ label: copy, text: copy, highlight: copy, footLabel: copy, footText: copy }),
    years: z.object({ eyebrow: copy, heading: copy, body: copy }),
    /** Head of the practice-areas section (spec 06). */
    areas: z.object({ eyebrow: copy, line1: copy, line2: copy, intro: copy }),
    practiceAreas: z.array(PracticeArea).length(4),
    /** Reviews section copy (spec 09). */
    reviewsHead: z.object({
      eyebrow: copy,
      heading: copy,
      note: copy,
      /** Shown instead of the slider while there are no approved reviews. */
      empty: copy,
      carouselLabel: copy,
      roleDescription: copy,
      prev: copy,
      next: copy,
      readMore: copy,
      readLess: copy,
    }),
    /** Approved reviews only, each with the client's consent (option A: added by hand from the submission email). */
    reviews: z.array(Review),
    /** Head of the process section (spec 07). */
    processHead: z.object({ eyebrow: copy, heading: copy }),
    process: z.array(ProcessStep).length(3),
    /** About (spec 08). Facts are derived from `office`; only their labels are copy here. */
    about: z.object({
      eyebrow: copy,
      /** The office name split over two lines; joined with a space it must equal office.name. */
      heading: z.tuple([copy, copy]),
      paragraphs: z.array(copy).min(1),
      factLabels: z.object({ experience: copy, license: copy, office: copy, education: copy, years: copy }),
      /** Empty while the photo repeats the hero portrait (decorative); descriptive once it shows the office. */
      photoAlt: z.string(),
      /** Yossi's real signature as an SVG path. Omitted until it exists: never an illustrative stand-in. */
      signature: z.object({ viewBox: z.string().regex(/^\d+ \d+ \d+ \d+$/), path: z.string().min(10) }).optional(),
    }),
    // Reviews are not in this file: approved reviews come from the database (specs 18, 19).
    /** Accessibility menu copy (spec 15). */
    a11y: z.object({
      open: copy,
      title: copy,
      close: copy,
      textSize: copy,
      smaller: copy,
      larger: copy,
      reset: copy,
      options: z.object({ contrast: copy, gray: copy, links: copy, font: copy, still: copy, cursor: copy }),
    }),
    /** Visit section copy (spec 11). Address, hours and access come from `office`. */
    visit: z.object({ eyebrow: copy, heading: copy, whatsappCta: copy, mapLabel: copy }),
    /** FAQ section copy (spec 10). */
    faqHead: z.object({ eyebrow: copy, heading: copy, intro: copy }),
    faq: z.array(Faq).min(3),
    finalCta: z.object({ line1: copy, line2: copy, body: copy }),
    legal: z.object({
      disclaimer: copy,
      accessibilityStatementPath: z.string().startsWith("/"),
      privacyPath: z.string().startsWith("/"),
      termsPath: z.string().startsWith("/"),
      /** Link labels for the legal pages (footer, accessibility menu). */
      accessibilityLabel: copy,
      privacyLabel: copy,
      termsLabel: copy,
      /** Legal page template copy (specs 16, 17). */
      backLabel: copy,
      updatedLabel: copy,
      tocLabel: copy,
      contactLabels: z.object({ phone: copy, email: copy, address: copy }),
    }),
    /** Search and sharing metadata (spec 16). */
    seo: z.object({
      description: copy.max(155),
      ogImageAlt: copy,
    }),
  })
  .refine((s) => s.hero.sub.includes(s.hero.subEmphasis), {
    message: "hero.subEmphasis must appear verbatim in hero.sub",
    path: ["hero", "subEmphasis"],
  })
  .refine((s) => s.about.heading.join(" ") === s.office.name, {
    message: "about.heading lines must join to office.name",
    path: ["about", "heading"],
  })
  .refine((s) => s.statement.text.includes(s.statement.highlight), {
    message: "statement.highlight must appear verbatim in statement.text",
    path: ["statement", "highlight"],
  })
  .refine(
    (s) =>
      s.practiceAreas.map((a) => a.id).join() === PracticeAreaId.options.join(),
    { message: "practiceAreas must be family, torts, real-estate, notary in that order", path: ["practiceAreas"] },
  );

/** Contact details printed on a legal page (e.g. the accessibility coordinator). */
export const LegalContact = z.object({
  name: copy,
  phoneDisplay: Office.shape.phoneDisplay,
  phoneE164: Office.shape.phoneE164,
  email: z.email(),
  address: copy.optional(),
});

/** One numbered clause. Lists render as bullets after the paragraphs. */
export const LegalSection = z.object({
  heading: copy,
  body: z.array(copy).min(1),
  items: z.array(copy).min(1).optional(),
  contact: LegalContact.optional(),
  /** Pointers to other pages (e.g. the privacy policy), rendered after the paragraphs. Internal paths only. */
  links: z.array(z.object({ label: copy, href: z.string().regex(/^\/[a-z-]*$/) })).min(1).optional(),
});

/**
 * A legal page (specs 16, 17). `approved` stays false until Yossi, as the lawyer, signs off on the wording;
 * an unapproved page blocks a production build like a placeholder does.
 */
export const LegalPage = z.object({
  slug: z.enum(["accessibility", "privacy", "terms"]),
  title: copy,
  /** ISO date, shown as dd.mm.yyyy. */
  updatedAt: z.iso.date(),
  approved: z.boolean(),
  intro: copy.optional(),
  sections: z.array(LegalSection).min(1),
});

export type Office = z.infer<typeof Office>;
export type PracticeArea = z.infer<typeof PracticeArea>;
export type PracticeAreaId = z.infer<typeof PracticeAreaId>;
export type ProcessStep = z.infer<typeof ProcessStep>;
export type Review = z.infer<typeof Review>;
export type Faq = z.infer<typeof Faq>;
export type NavLink = z.infer<typeof NavLink>;
export type WhatsappCopy = z.infer<typeof WhatsappCopy>;
export type Site = z.infer<typeof Site>;
export type LegalContact = z.infer<typeof LegalContact>;
export type LegalSection = z.infer<typeof LegalSection>;
export type LegalPage = z.infer<typeof LegalPage>;
export type LegalSlug = LegalPage["slug"];
