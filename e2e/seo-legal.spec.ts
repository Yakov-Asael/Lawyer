import { expect, test } from "./fixtures";

/** Specs 16 and 17: metadata, structured data, sitemap/robots and the legal pages. */

const OFFICE = { name: "עו״ד יוסי שוקרון כהן", address: "הרברט סמואל 27", city: "חדרה", phone: "+972522521127" };
const LEGAL = [
  { path: "/accessibility-statement", title: "הצהרת נגישות" },
  { path: "/privacy-policy", title: "מדיניות פרטיות" },
  { path: "/terms", title: "תקנון האתר" },
] as const;

test.describe("home metadata", () => {
  test("title, description, canonical, Open Graph and icons", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("עו״ד יוסי שוקרון כהן | עורך דין ונוטריון בחדרה");
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description!.length).toBeLessThanOrEqual(155);
    for (const word of ["משפחה", "נזיקין", "מקרקעין", "נוטריון", "חדרה"]) expect(description).toContain(word);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\/[^/]+\/?$/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\.png$/);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "he_IL");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('link[rel="icon"][type="image/png"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    for (const asset of ["/og.png", "/favicon.ico"]) expect((await page.request.get(asset)).status()).toBe(200);
  });

  test("one H1 and LegalService + FAQPage JSON-LD with the office NAP byte for byte", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent!)));
    const office = blocks.find((b) => b["@type"] === "LegalService");
    expect(office.name).toBe(OFFICE.name);
    expect(office.address.streetAddress).toBe(OFFICE.address);
    expect(office.address.addressLocality).toBe(OFFICE.city);
    expect(office.telephone).toBe(OFFICE.phone);
    expect(office.founder["@type"]).toBe("Person");
    expect(JSON.stringify(blocks)).not.toContain("AggregateRating");
    expect(blocks.some((b) => b["@type"] === "FAQPage")).toBe(true);
  });

  test("robots.txt keeps previews out; sitemap lists home and the legal pages", async ({ request }) => {
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const { path } of LEGAL) expect(sitemap).toContain(`${path}</loc>`);
  });
});

for (const { path, title } of LEGAL) {
  test.describe(title, () => {
    test("renders from content: one H1, updated date, numbered clauses, canonical", async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(`${title} | ${OFFICE.name}`);
      await expect(page.locator("h1")).toHaveText(title);
      await expect(page.locator("main time")).toHaveText(/^\d{2}\.\d{2}\.\d{4}$/);
      const clauses = page.locator("article > section");
      expect(await clauses.count()).toBeGreaterThan(3);
      await expect(clauses.first().locator("h2")).toHaveText(/^1\./);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path}$`));
      await expect(page.getByRole("banner").getByRole("link", { name: "חזרה לאתר" })).toHaveAttribute("href", "/");
      // No home-page chrome: no intro curtain, no hero.
      await expect(page.locator(".curtain")).toHaveCount(0);
    });

    test("table of contents jumps to every clause", async ({ page, isMobile }) => {
      await page.goto(path);
      const nav = page.getByRole("navigation", { name: "תוכן העניינים" });
      if (isMobile) await nav.locator("summary").click();
      const links = nav.getByRole("link");
      const count = await links.count();
      expect(count).toBe(await page.locator("article > section").count());
      const last = links.nth(count - 1);
      const target = (await last.getAttribute("href"))!;
      await last.click();
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.locator(target)).toBeInViewport();
    });

    test("contact block uses live tel/mailto links", async ({ page }) => {
      await page.goto(path);
      const card = page.locator("article dl").last();
      await expect(card.locator('a[href="tel:+972522521127"]')).toHaveCount(1);
      await expect(card.locator('a[href^="mailto:"]')).toHaveCount(1);
    });

    test("text passes 4.5:1 contrast", async ({ page }) => {
      await page.goto(path);
      const failures = await page.evaluate(() => {
        const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", {
          willReadFrequently: true,
        })!;
        const rgba = (css: string) => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = css;
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
          return { r: r!, g: g!, b: b!, a: a! / 255 };
        };
        const bgOf = (el: Element) => {
          for (let n: Element | null = el; n; n = n.parentElement) {
            const c = rgba(getComputedStyle(n).backgroundColor);
            if (c.a > 0.99) return c;
          }
          return rgba(getComputedStyle(document.body).backgroundColor);
        };
        const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
          const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        return [...document.querySelectorAll("main :is(h1, h2, p, li, a, dt, dd, time, summary)")]
          .filter((el) => el.checkVisibility() && el.textContent?.trim())
          .map((el) => {
            const fg = lum(rgba(getComputedStyle(el).color));
            const bg = lum(bgOf(el));
            return { text: el.textContent!.trim().slice(0, 30), ratio: (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05) };
          })
          .filter((r) => r.ratio < 4.5);
      });
      expect(failures).toEqual([]);
    });

    test("no console errors or hydration warnings", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error" || /hydrat/i.test(m.text())) errors.push(m.text());
      });
      await page.goto(path, { waitUntil: "networkidle" });
      expect(errors).toEqual([]);
    });
  });
}

test("footer and accessibility menu link to every legal page", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  for (const { path, title } of LEGAL) await expect(footer.getByRole("link", { name: title })).toHaveAttribute("href", path);
  await page.getByRole("button", { name: "תפריט נגישות" }).click();
  const panel = page.getByRole("dialog");
  for (const { path, title } of LEGAL) await expect(panel.getByRole("link", { name: title })).toHaveAttribute("href", path);
});

test("legal pages are reachable from the footer of a legal page", async ({ page }) => {
  await page.goto("/accessibility-statement");
  await page.getByRole("contentinfo").getByRole("link", { name: "מדיניות פרטיות" }).click();
  await expect(page).toHaveURL(/\/privacy-policy$/);
  await expect(page.locator("h1")).toHaveText("מדיניות פרטיות");
});

test.describe("terms (spec 17)", () => {
  test("no-advice and no-relationship clauses are visible without expanding anything", async ({ page }) => {
    await page.goto("/terms");
    for (const [n, heading] of [[2, "אין ייעוץ משפטי"], [3, "אין יחסי עורך דין ולקוח"]] as const) {
      const clause = page.locator(`#clause-${n}`);
      await expect(clause.locator("h2")).toHaveText(`${n}.${heading}`);
      await expect(clause.locator("p").first()).toBeVisible();
    }
  });

  test("every clause has a working anchor; clause links lead to privacy and accessibility", async ({ page }) => {
    await page.goto("/terms");
    const count = await page.locator("article > section").count();
    expect(count).toBe(13);
    for (let n = 1; n <= count; n++) await expect(page.locator(`#clause-${n} h2`)).toHaveText(new RegExp(`^${n}\\.`));
    await page.goto("/terms#clause-12");
    await expect(page.locator("#clause-12")).toBeInViewport();
    await page.locator("#clause-8").getByRole("link", { name: "מדיניות פרטיות" }).click();
    await expect(page).toHaveURL(/\/privacy-policy$/);
    await page.goto("/terms");
    await expect(page.locator("#clause-9").getByRole("link", { name: "הצהרת נגישות" })).toHaveAttribute(
      "href",
      "/accessibility-statement",
    );
  });
});
