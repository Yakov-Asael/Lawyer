import { describe, expect, it } from "vitest";
import { absoluteUrl, resolveSiteUrl } from "./site-url";

describe("resolveSiteUrl", () => {
  it("prefers SITE_URL, then Netlify's URL, then localhost", () => {
    expect(resolveSiteUrl({ SITE_URL: "https://example.co.il", URL: "https://x.netlify.app" }).href).toBe(
      "https://example.co.il/",
    );
    expect(resolveSiteUrl({ URL: "https://x.netlify.app" }).href).toBe("https://x.netlify.app/");
    expect(resolveSiteUrl({}).href).toBe("http://localhost:3000/");
  });
  it("builds absolute URLs from paths", () => {
    expect(absoluteUrl("/privacy-policy", new URL("https://example.co.il/"))).toBe(
      "https://example.co.il/privacy-policy",
    );
  });
});
