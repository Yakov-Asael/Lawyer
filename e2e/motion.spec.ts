import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 00 motion system: reveals, smooth scroll, and the reduced-motion fallback. */

/** A reveal block far below the fold: the map in the visit section. */
const BELOW_FOLD = "#visit .reveal:has([data-map])";

const opacityOf = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe("motion on", () => {
  test("arms motion after hydration and starts Lenis", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bmotion\b/);
    await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  });

  test("hero entrance runs on CSS alone and ends fully visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
    const states = await page.evaluate(() =>
      [...document.querySelectorAll(".hero-in, .hero-line > span")].map((el) => {
        const s = getComputedStyle(el);
        return { opacity: s.opacity, transform: s.transform };
      }),
    );
    expect(states.length).toBeGreaterThan(4);
    for (const s of states) {
      expect(s.opacity).toBe("1");
      expect(s.transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    }
  });

  test("a block below the fold waits, then reveals once scrolled into view", async ({ page }) => {
    await page.setViewportSize({ width: page.viewportSize()!.width, height: 500 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bmotion\b/);
    const block = page.locator(BELOW_FOLD);
    await expect(block).not.toHaveAttribute("data-in");
    expect(await opacityOf(page, BELOW_FOLD)).toBe(0);

    await block.scrollIntoViewIfNeeded();
    await expect(block).toHaveAttribute("data-in", "");
    await expect.poll(() => opacityOf(page, BELOW_FOLD)).toBe(1);

    // Plays once: scrolling away keeps it revealed.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(block).toHaveAttribute("data-in", "");
  });

  test("headings keep whole text for assistive tech", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ליווי משפטי אישי. 30 שנה בחדרה.");
    await expect(page.locator("#years-title")).toHaveText("שלושים שנה של עבודה משפטית בחדרה");
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
    expect(await opacityOf(page, BELOW_FOLD)).toBe(1);
    const shifted = await page.evaluate(
      () => [...document.querySelectorAll(".mask-piece > span")].filter((el) => getComputedStyle(el).transform !== "none").length,
    );
    expect(shifted).toBe(0);
  });
});
