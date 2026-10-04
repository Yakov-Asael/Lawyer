import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { site } from "@content";
import {
  areaFromParam,
  EMPTY_REVIEW,
  encodeReview,
  firstInvalid,
  HONEYPOT_FIELD,
  LIMITS,
  normalizeIlPhone,
  REVIEW_FIELDS,
  REVIEW_FORM_NAME,
  validateReview,
  type ReviewValues,
} from "./review-form";

const valid: ReviewValues = {
  name: "דנה כ.",
  area: "torts",
  review: "המשרד ליווה אותי בסבלנות ובמקצועיות לאורך כל הדרך, תמיד זמין ותמיד ענייני.",
  phone: "",
  consent: true,
};

describe("validateReview", () => {
  it("an empty form fails every required field and the consent, in screen order", () => {
    const errors = validateReview(EMPTY_REVIEW);
    expect(errors).toEqual({ name: "name", area: "area", review: "reviewShort", consent: "consent" });
    expect(firstInvalid(errors)).toBe("name");
  });

  it("a valid form has no errors; the phone is optional", () => {
    expect(validateReview(valid)).toEqual({});
    expect(validateReview({ ...valid, phone: "052-252-1127" })).toEqual({});
  });

  it("enforces the length limits, counting trimmed characters", () => {
    expect(validateReview({ ...valid, name: " א " }).name).toBe("name");
    expect(validateReview({ ...valid, name: "א".repeat(41) }).name).toBe("name");
    expect(validateReview({ ...valid, review: "א".repeat(39) }).review).toBe("reviewShort");
    expect(validateReview({ ...valid, review: "א".repeat(601) }).review).toBe("reviewLong");
  });

  it("rejects an unknown area and a malformed phone", () => {
    expect(validateReview({ ...valid, area: "x" as never }).area).toBe("area");
    expect(validateReview({ ...valid, phone: "12345" }).phone).toBe("phone");
  });
});

describe("normalizeIlPhone", () => {
  it.each([
    ["052-252-1127", "0522521127"],
    ["+972 52 252 1127", "0522521127"],
    ["972522521127", "0522521127"],
    ["04-6333333", "046333333"],
    ["077-1234567", "0771234567"],
  ])("%s -> %s", (raw, local) => expect(normalizeIlPhone(raw)).toBe(local));

  it.each(["", "052-252-112", "06-1234567", "abc", "+1 555 123 4567"])("rejects %s", (raw) =>
    expect(normalizeIlPhone(raw)).toBeNull(),
  );
});

describe("encodeReview", () => {
  it("builds the Netlify payload with the area label and a normalised phone", () => {
    const body = new URLSearchParams(encodeReview({ ...valid, phone: "+972522521127" }, "נזיקין וביטוח", "כן"));
    expect(body.get("form-name")).toBe(REVIEW_FORM_NAME);
    expect(body.get(HONEYPOT_FIELD)).toBe("");
    expect(body.get("area")).toBe("נזיקין וביטוח");
    expect(body.get("phone")).toBe("0522521127");
    expect(body.get("consent")).toBe("כן");
  });
});

describe("areaFromParam", () => {
  it("accepts only the four practice areas", () => {
    expect(areaFromParam("torts")).toBe("torts");
    expect(areaFromParam("<script>")).toBe("");
    expect(areaFromParam(null)).toBe("");
  });
});

describe("static detection form", () => {
  const html = readFileSync(join(process.cwd(), "public/__forms.html"), "utf8");
  it("declares the review form, its honeypot and every field the site posts", () => {
    expect(html).toContain(`name="${REVIEW_FORM_NAME}" data-netlify="true" netlify-honeypot="${HONEYPOT_FIELD}"`);
    for (const field of [...REVIEW_FIELDS, HONEYPOT_FIELD]) expect(html).toMatch(new RegExp(`name="${field}"`));
  });
});

describe("error copy", () => {
  it("quotes the limits the validator enforces", () => {
    const e = site.reviewForm.errors;
    expect(e.name).toContain(String(LIMITS.name.min));
    expect(e.name).toContain(String(LIMITS.name.max));
    expect(e.reviewShort).toContain(String(LIMITS.review.min));
    expect(e.reviewLong).toContain(String(LIMITS.review.max));
  });
});
