import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { blockingPlaceholders, LEGAL_PATHS, LegalPage, legalPage, legalPages, site, unapprovedLegalPages } from "./index";
import { accessibilityPage } from "./legal/accessibility";

describe("legal pages (specs 16, 17)", () => {
  it("each published page has a route under src/app/(legal) at the path the footer links to", () => {
    for (const page of legalPages) {
      const dir = LEGAL_PATHS[page.slug].slice(1);
      expect(existsSync(join(process.cwd(), "src/app/(legal)", dir, "page.tsx")), dir).toBe(true);
    }
  });

  it("the accessibility statement carries what the regulations require", () => {
    const page = legalPage("accessibility");
    const text = JSON.stringify(page);
    expect(text).toContain("5568");
    expect(text).toContain("AA");
    expect(page.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const contact = page.sections.find((s) => s.contact)?.contact;
    expect(contact?.phoneE164).toBe(site.office.phoneE164);
    expect(contact?.email).toBe(site.office.email);
  });

  it("terms: the jurisdiction clause blocks production until Yossi fills it", () => {
    const terms = legalPage("terms");
    const clause = terms.sections.findIndex((s) => s.heading === "דין וסמכות שיפוט");
    expect(clause).toBe(11);
    expect(blockingPlaceholders({ legal: [terms] })).toContain(`legal[0].sections[${clause}].body[0]`);
    expect(terms.sections[1]!.heading).toBe("אין ייעוץ משפטי");
    expect(terms.sections[2]!.heading).toBe("אין יחסי עורך דין ולקוח");
  });

  it("an unapproved page blocks production; an approved one does not", () => {
    expect(unapprovedLegalPages([{ slug: "privacy", approved: false }])).toEqual(["legal/privacy (not approved)"]);
    expect(unapprovedLegalPages([{ slug: "privacy", approved: true }])).toEqual([]);
  });

  it("rejects em-dashes and a malformed date", () => {
    const sections = [{ heading: "א", body: ["טקסט — עם קו"] }];
    expect(() => LegalPage.parse({ ...accessibilityPage, sections })).toThrow();
    expect(() => LegalPage.parse({ ...accessibilityPage, updatedAt: "4.10.2026" })).toThrow();
  });

  it("keeps the SEO description within 155 characters and naming the city", () => {
    expect(site.seo.description.length).toBeLessThanOrEqual(155);
    expect(site.seo.description).toContain(site.office.city);
  });
});
