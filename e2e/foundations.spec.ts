import { expect, test } from "./fixtures";

/** Spec 00 acceptance criteria that apply before any section exists. */

test.describe("foundations shell", () => {
  test("document is Hebrew RTL with one h1", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "he");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("loads both brand fonts", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const families = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family));
    expect(families.join(" ")).toMatch(/Frank Ruhl Libre/);
    expect(families.join(" ")).toMatch(/Assistant/);
  });

  test("skip link is the first tab stop and moves focus to main", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard flow is checked on desktop");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "דלג לתוכן" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#content")).toBeFocused();
  });

  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("content is fully visible with reduced motion and without JS", async ({ browser }) => {
    for (const options of [{ reducedMotion: "reduce" as const }, { javaScriptEnabled: false }]) {
      const context = await browser.newContext(options);
      const page = await context.newPage();
      await page.goto("/");
      await expect(page.locator("h1")).toBeVisible();
      const hidden = await page.evaluate(
        () => [...document.querySelectorAll("main *")].filter((el) => getComputedStyle(el).opacity === "0").length,
      );
      expect(hidden).toBe(0);
      await context.close();
    }
  });

  test("no console errors or hydration warnings", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" || /hydrat/i.test(m.text())) problems.push(m.text());
    });
    page.on("pageerror", (e) => problems.push(e.message));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);
  });

  test("screenshot", async ({ page }, info) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `test-results/screens/reveal-mid-${info.project.name}.png` });
    // Reveal everything below the fold too, then wait for every transition to settle.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
    await page.screenshot({ path: `test-results/screens/foundations-${info.project.name}.png`, fullPage: true });
  });
});
