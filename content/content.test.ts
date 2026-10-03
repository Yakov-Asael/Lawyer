import { describe, expect, it } from "vitest";
import { blockingPlaceholders, findPlaceholders, Review, Site, site } from "./index";
import { siteContent } from "./site";

describe("site content", () => {
  it("passes the contract", () => {
    expect(() => Site.parse(siteContent)).not.toThrow();
  });

  it("keeps phone, WhatsApp and display number consistent", () => {
    const digits = site.office.phoneDisplay.replaceAll("-", "").slice(1);
    expect(site.office.phoneE164).toBe(`+972${digits}`);
    expect(site.office.whatsappE164).toBe(`972${digits}`);
  });

  it("lists the four practice areas in the agreed order", () => {
    expect(site.practiceAreas.map((a) => a.id)).toEqual(["family", "torts", "real-estate", "notary"]);
  });

  it("does not let FAQ answers block production (unanswered items are excluded instead)", () => {
    const blocking = blockingPlaceholders(site);
    expect(blocking.some((p) => p.startsWith("faq["))).toBe(false);
    expect(blocking).toContain("about.paragraphs[0]");
  });

  it("reports open placeholders by path", () => {
    const open = findPlaceholders(site);
    expect(open).toContain("about.paragraphs[0]");
    expect(open).toContain("practiceAreas[0].servicesNote");
    expect(open.every((p) => /^(about\.|faq\[|practiceAreas\[\d\]\.servicesNote)/.test(p))).toBe(true);
  });
});

describe("contract rules", () => {
  const withStatement = (statement: Partial<typeof siteContent.statement>) => ({
    ...siteContent,
    statement: { ...siteContent.statement, ...statement },
  });

  it("rejects em-dashes in copy", () => {
    expect(Site.safeParse(withStatement({ footText: "בלי — מתווכים" })).success).toBe(false);
  });

  it("rejects emojis in copy", () => {
    expect(Site.safeParse(withStatement({ footText: "בלי מתווכים \u{1F44D}" })).success).toBe(false);
  });

  it("requires the highlight to appear in the statement", () => {
    expect(Site.safeParse(withStatement({ highlight: "משהו אחר" })).success).toBe(false);
  });

  it("rejects a malformed WhatsApp number", () => {
    const bad = { ...siteContent, office: { ...siteContent.office, whatsappE164: "+972522521127" } };
    expect(Site.safeParse(bad).success).toBe(false);
  });

  it("rejects practice areas out of order", () => {
    const [a, b, c, d] = siteContent.practiceAreas;
    expect(Site.safeParse({ ...siteContent, practiceAreas: [b, a, c, d] }).success).toBe(false);
  });

  it("keeps the about heading equal to the office name", () => {
    const bad = { ...siteContent, about: { ...siteContent.about, heading: ["עו״ד יוסי", "כהן"] as [string, string] } };
    expect(Site.safeParse(bad).success).toBe(false);
  });

  it("requires review consent", () => {
    const review = { quote: "x".repeat(40), clientName: "ד״כ", area: "family", consentConfirmed: false };
    expect(Review.safeParse(review).success).toBe(false);
  });
});
