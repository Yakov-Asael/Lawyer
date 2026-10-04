import { PracticeAreaId } from "@content";

/**
 * Review submission (spec 18): limits, validation and the Netlify Forms payload. Pure, so it is unit-tested
 * and shared by the dialog and the /review page.
 */

/** The Netlify form name; public/__forms.html declares the same form so Netlify detects it at deploy time. */
export const REVIEW_FORM_NAME = "review";
/** Where the form posts: the static detection file, as the Netlify Next.js runtime requires. */
export const REVIEW_FORM_ACTION = "/__forms.html";
/** Netlify drops any submission with this field filled. */
export const HONEYPOT_FIELD = "bot-field";
/** Field names as Netlify stores them (and as the notification email lists them). */
export const REVIEW_FIELDS = ["name", "area", "review", "phone", "consent"] as const;

export const LIMITS = { name: { min: 2, max: 40 }, review: { min: 40, max: 600 } } as const;

export type ReviewValues = {
  name: string;
  area: PracticeAreaId | "";
  review: string;
  phone: string;
  consent: boolean;
};

export type ReviewErrorKey = "name" | "area" | "reviewShort" | "reviewLong" | "phone" | "consent";
export type ReviewErrors = Partial<Record<keyof ReviewValues, ReviewErrorKey>>;

export const EMPTY_REVIEW: ReviewValues = { name: "", area: "", review: "", phone: "", consent: false };

/** Order of fields on screen, so focus can move to the first invalid one. */
export const FIELD_ORDER: readonly (keyof ReviewValues)[] = ["name", "area", "review", "phone", "consent"];

/** Length as a person counts it (Hebrew letters and emoji are one each). */
export const charCount = (s: string) => [...s.trim()].length;

/**
 * An Israeli phone number in local form (0XX...), or null. Accepts spaces, dashes and a +972 / 972 prefix.
 * Mobile and 07X numbers have 10 digits, landlines (02, 03, 04, 08, 09) have 9.
 */
export function normalizeIlPhone(raw: string): string | null {
  let digits = raw.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+972")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("972")) digits = `0${digits.slice(3)}`;
  return /^0(?:5\d{8}|7\d{8}|[2-489]\d{7})$/.test(digits) ? digits : null;
}

/** Field errors for a submission; empty when it can be sent. */
export function validateReview(v: ReviewValues): ReviewErrors {
  const errors: ReviewErrors = {};
  const name = charCount(v.name);
  if (name < LIMITS.name.min || name > LIMITS.name.max) errors.name = "name";
  if (!PracticeAreaId.safeParse(v.area).success) errors.area = "area";
  const review = charCount(v.review);
  if (review < LIMITS.review.min) errors.review = "reviewShort";
  else if (review > LIMITS.review.max) errors.review = "reviewLong";
  if (v.phone.trim() && !normalizeIlPhone(v.phone)) errors.phone = "phone";
  if (!v.consent) errors.consent = "consent";
  return errors;
}

/** The first invalid field in screen order, for focus. */
export function firstInvalid(errors: ReviewErrors): keyof ReviewValues | undefined {
  return FIELD_ORDER.find((f) => errors[f]);
}

/**
 * The urlencoded body Netlify Forms expects. The area goes as its label, so the email reads naturally;
 * the phone is normalised. `honeypot` carries whatever a bot typed into the hidden field.
 */
export function encodeReview(v: ReviewValues, areaLabel: string, consentLabel: string, honeypot = ""): string {
  return new URLSearchParams({
    "form-name": REVIEW_FORM_NAME,
    [HONEYPOT_FIELD]: honeypot,
    name: v.name.trim(),
    area: areaLabel,
    review: v.review.trim(),
    phone: v.phone.trim() ? (normalizeIlPhone(v.phone) ?? v.phone.trim()) : "",
    consent: v.consent ? consentLabel : "",
  }).toString();
}

/** A valid ?area= value, or "" (unknown values are ignored, never trusted). */
export function areaFromParam(param: string | null | undefined): PracticeAreaId | "" {
  const parsed = PracticeAreaId.safeParse(param);
  return parsed.success ? parsed.data : "";
}
