import { expect, test } from "@playwright/test";

/** Spec 01 acceptance criteria, checked on every button the page renders. */

const PHONE = "+972522521127";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("buttons pass 4.5:1 text contrast against their real background", async ({ page }) => {
  const results = await page.evaluate(() => {
    const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", {
      willReadFrequently: true,
    })!;
    // Resolve any CSS color (color-mix, color(), rgb) to sRGB via the canvas.
    const rgba = (css: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return { r: r!, g: g!, b: b!, a: a! / 255 };
    };
    const bgOf = (el: Element | null): { r: number; g: number; b: number } => {
      for (; el; el = el.parentElement) {
        const c = rgba(getComputedStyle(el).backgroundColor);
        if (c.a > 0.99) return c;
      }
      return { r: 255, g: 255, b: 255 };
    };
    const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    return [...document.querySelectorAll('[data-slot="button"]')].map((el) => {
      const fg = lum(rgba(getComputedStyle(el).color));
      const bg = lum(bgOf(el));
      const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      return { label: el.getAttribute("aria-label") ?? el.textContent?.trim(), ratio: Math.round(ratio * 100) / 100 };
    });
  });
  expect(results.length).toBeGreaterThanOrEqual(8);
  for (const r of results) expect(r.ratio, r.label ?? "").toBeGreaterThanOrEqual(4.5);
});

test("button text is optically centered within 1.5px", async ({ page }) => {
  const offsets = await page.evaluate(() =>
    [...document.querySelectorAll('[data-slot="button"]')]
      .filter((el) => el.textContent?.trim())
      .map((el) => {
        const label = [...el.querySelectorAll("span")].at(-1) ?? el;
        const range = document.createRange();
        range.selectNodeContents(label);
        // Glyph box of the Hebrew text, not the line box.
        const text = range.getBoundingClientRect();
        const box = el.getBoundingClientRect();
        return {
          label: el.textContent!.trim(),
          dy: Math.abs(text.top + text.height / 2 - (box.top + box.height / 2)),
        };
      }),
  );
  expect(offsets.length).toBeGreaterThan(0);
  for (const o of offsets) expect(o.dy, o.label).toBeLessThanOrEqual(1.5);
});

test("every icon-only control has an accessible name", async ({ page }) => {
  const unnamed = await page.evaluate(() =>
    [...document.querySelectorAll("a, button")]
      .filter((el) => !el.textContent?.trim() && !el.getAttribute("aria-label")?.trim())
      .map((el) => el.outerHTML.slice(0, 80)),
  );
  expect(unnamed).toEqual([]);
});

test("contact links open the right targets in a new tab", async ({ page }) => {
  const call = page.getByRole("link", { name: "חיוג ל-052-252-1127" }).first();
  await expect(call).toHaveAttribute("href", `tel:${PHONE}`);

  const wa = page.locator('a[href^="https://wa.me/"]');
  expect(await wa.count()).toBeGreaterThanOrEqual(3);
  const texts = await wa.evaluateAll((els) =>
    els.map((a) => new URL((a as HTMLAnchorElement).href).searchParams.get("text")),
  );
  expect(texts).toContain("שלום עו״ד שוקרון כהן, אשמח להתייעץ.");
  expect(texts).toContain("שלום עו״ד שוקרון כהן, אשמח להתייעץ בנושא דיני משפחה וירושה.");

  for (const link of await page.locator('a[href^="https://"], a[href^="tel:"]').all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
  // The number is never button text.
  await expect(page.locator('[data-slot="button"]', { hasText: "052-252-1127" })).toHaveCount(0);
});

test("buttons show a 2px focus ring on keyboard focus", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow is checked on desktop");
  for (let i = 0; i < 2; i++) await page.keyboard.press("Tab"); // skip link, then the first button
  const ring = await page.evaluate(() => {
    const el = document.activeElement!;
    const s = getComputedStyle(el);
    return { slot: el.getAttribute("data-slot"), style: s.outlineStyle, width: s.outlineWidth, offset: s.outlineOffset };
  });
  expect(ring).toEqual({ slot: "button", style: "solid", width: "2px", offset: "3px" });
});

test("seal ring text starts at the top and runs right to left", async ({ page }) => {
  const ring = page.locator("[data-ring]").first();
  const glyphs = await ring.locator("text").evaluateAll((els) =>
    els.slice(0, 4).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }),
  );
  const [first, second, third] = glyphs;
  // Each next glyph sits to the left of the previous one along the top arc (right-to-left reading).
  expect(second!.x).toBeLessThan(first!.x);
  expect(third!.x).toBeLessThan(second!.x);
  // And starts curving down, not up.
  expect(third!.y).toBeGreaterThanOrEqual(first!.y - 0.5);
});

test("screenshot", async ({ page }, info) => {
  await page.screenshot({ path: `test-results/screens/shared-${info.project.name}.png`, fullPage: true });
});
