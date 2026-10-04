import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 12: final CTA. */

const SECTION = "section[aria-labelledby=final-title]";
const STAMP = `${SECTION} svg.seal-stamp`;

const stampState = (page: Page) =>
  page.locator(STAMP).evaluate((el) => {
    const s = getComputedStyle(el);
    const m = new DOMMatrix(s.transform);
    return {
      inView: el.hasAttribute("data-in"),
      opacity: Number(s.opacity),
      angle: Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI),
      scale: Math.round(Math.hypot(m.a, m.b) * 100) / 100,
      // Finished animations stay listed while they hold their last frame (fill: forwards); count only live ones.
      running: el.getAnimations().filter((a) => a.playState === "running").length,
    };
  });

test("stamp waits until visible, plays once, then rests at -8deg", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  const before = await stampState(page);
  expect(before.inView).toBe(false);
  expect(before.opacity).toBe(0);

  await page.locator(STAMP).scrollIntoViewIfNeeded();
  await expect.poll(() => stampState(page).then((s) => s.inView)).toBe(true);
  await expect.poll(() => stampState(page).then((s) => s.running), { timeout: 3000 }).toBe(0);
  expect(await stampState(page)).toMatchObject({ opacity: 1, angle: -8, scale: 1 });

  // Scrolling away and back does not replay it.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);
  await page.locator(STAMP).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  expect(await stampState(page)).toMatchObject({ running: 0, angle: -8, opacity: 1 });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("stamp is static at -8deg", async ({ page }) => {
    await page.goto("/");
    expect(await stampState(page)).toMatchObject({ opacity: 1, angle: -8, scale: 1, running: 0 });
  });
});

test("buttons behave exactly like the hero's ContactButtons", async ({ page }) => {
  await page.goto("/");
  const pick = (root: string) =>
    page.locator(`${root} [data-slot=button]`).evaluateAll((links) =>
      links.map((a) => ({
        href: a.getAttribute("href"),
        target: a.getAttribute("target"),
        rel: a.getAttribute("rel"),
        label: a.getAttribute("aria-label") ?? a.textContent?.trim(),
      })),
    );
  const hero = await pick("section[aria-labelledby=hero-title]");
  const final = await pick(SECTION);
  expect(final).toEqual(hero);
  await expect(page.locator(SECTION)).not.toContainText("052-252-1127");
});

test("phones keep both buttons on one row", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  await page.goto("/");
  const ys = await page.locator(`${SECTION} [data-slot=button]`).evaluateAll((els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2)),
  );
  expect(new Set(ys).size).toBe(1);
});

test("fits one viewport at 1440x900", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop criterion");
  await page.goto("/");
  const height = await page.locator(SECTION).evaluate((el) => el.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(900);
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await page.locator(SECTION).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  await page.locator(SECTION).screenshot({ path: `test-results/screens/final-${info.project.name}.png` });
});
