import { expect, test, type Page } from "@playwright/test";

/** Spec 00 motion system: reveals, smooth scroll, and the reduced-motion fallback. */

const opacityOf = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe("motion on", () => {
  test("arms motion after hydration and starts Lenis", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bmotion\b/);
    await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  });

  test("above-the-fold heading and copy reveal on load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1.mask")).toHaveAttribute("data-in", "");
    await expect.poll(() => opacityOf(page, "section >> nth=0 >> .reveal >> nth=0")).toBe(1);
  });

  test("a block below the fold waits, then reveals once scrolled into view", async ({ page }) => {
    await page.setViewportSize({ width: page.viewportSize()!.width, height: 500 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bmotion\b/);
    const block = page.getByTestId("below-fold-reveal");
    await expect(block).not.toHaveAttribute("data-in");
    expect(await opacityOf(page, '[data-testid="below-fold-reveal"]')).toBe(0);

    await block.scrollIntoViewIfNeeded();
    await expect(block).toHaveAttribute("data-in", "");
    await expect.poll(() => opacityOf(page, '[data-testid="below-fold-reveal"]')).toBe(1);

    // Plays once: scrolling away keeps it revealed.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(block).toHaveAttribute("data-in", "");
  });

  test("mask keeps the heading as whole text for assistive tech", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ליווי משפטי אישי. 30 שנה בחדרה.");
  });
});

test.describe("motion off", () => {
  test.use({ reducedMotion: "reduce" });

  test("reduced motion: no motion class, no Lenis, everything in final state", async ({ page }) => {
    await page.setViewportSize({ width: page.viewportSize()!.width, height: 500 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/\bmotion\b/);
    await expect(html).not.toHaveClass(/\blenis\b/);
    expect(await opacityOf(page, '[data-testid="below-fold-reveal"]')).toBe(1);
    const shifted = await page.evaluate(
      () => [...document.querySelectorAll(".mask-piece > span")].filter((el) => getComputedStyle(el).transform !== "none").length,
    );
    expect(shifted).toBe(0);
  });
});
