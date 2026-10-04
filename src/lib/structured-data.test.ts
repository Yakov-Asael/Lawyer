import { describe, expect, it } from "vitest";
import { site } from "@content/data";
import { jsonLdScript, officeJsonLd } from "./structured-data";

const data = officeJsonLd(site.office, {
  url: "https://example.co.il/",
  image: "https://example.co.il/og.png",
  description: site.seo.description,
});

describe("officeJsonLd", () => {
  it("copies name, address and phone byte for byte from office (NAP)", () => {
    expect(data["@type"]).toBe("LegalService");
    expect(data.name).toBe(site.office.name);
    expect(data.address.streetAddress).toBe(site.office.address);
    expect(data.address.addressLocality).toBe(site.office.city);
    expect(data.telephone).toBe(site.office.phoneE164);
    expect(data.areaServed.name).toBe(site.office.city);
  });

  it("links Yossi as founder and never claims a rating", () => {
    expect(data.founder["@type"]).toBe("Person");
    expect(data.founder.worksFor["@id"]).toBe(data["@id"]);
    expect(JSON.stringify(data)).not.toContain("Rating");
  });
});

describe("jsonLdScript", () => {
  it("escapes < so content cannot close the script tag", () => {
    expect(jsonLdScript({ a: "</script>" })).toBe('{"a":"\\u003c/script>"}');
  });
});
