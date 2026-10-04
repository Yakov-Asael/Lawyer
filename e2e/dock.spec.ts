import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 14: phone contact dock. */

const DOCK = 'nav[aria-label="יצירת קשר מהירה"]';

const dockState = (page: Page) =>
  page.locator(DOCK).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { onScreen: r.top < window.innerHeight - 1, inert: (el as HTMLElement).inert };
  });

test.describe("phones", () => {
  test.skip(({ isMobile }) => !isMobile, "phone only");

  test("hidden and inert on first load; slides in past the hero; out again back at the hero", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(300);
    expect(await dockState(page)).toEqual({ onScreen: false, inert: true });

    await page.evaluate(() => {
      const hero = document.querySelector("section[aria-labelledby=hero-title]")!;
      window.scrollTo({ top: hero.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.3, behavior: "instant" });
    });
    await expect.poll(() => dockState(page)).toEqual({ onScreen: true, inert: false });

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(() => dockState(page)).toEqual({ onScreen: false, inert: true });
  });

  test("WhatsApp and call targets; tap targets at least 48px", async ({ page }) => {
    await page.goto("/");
    const dock = page.locator(DOCK);
    const wa = dock.getByRole("link", { name: "וואטסאפ" });
    const call = dock.getByRole("link", { name: "חיוג ל-052-252-1127" });
    expect(new URL((await wa.getAttribute("href"))!).searchParams.get("text")).toBe("שלום עו״ד שוקרון כהן, אשמח להתייעץ.");
    await expect(call).toHaveAttribute("href", "tel:+972522521127");
    for (const link of [wa, call]) {
      const box = (await link.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(48);
      expect(box.width).toBeGreaterThanOrEqual(48);
    }
  });

  test("shown dock: button text meets 4.5:1 on the dock ground", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
    await expect.poll(() => dockState(page).then((s) => s.onScreen)).toBe(true);
    await page.waitForTimeout(600);
    const ratios = await page.locator(`${DOCK} a`).evaluateAll((links) => {
      const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true })!;
      const rgba = (css: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = css;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return { r: r!, g: g!, b: b!, a: a! / 255 };
      };
      const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
        const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const dock = links[0]!.closest("nav")!;
      return links.map((a) => {
        const own = rgba(getComputedStyle(a).backgroundColor);
        const bg = own.a > 0.99 ? own : rgba(getComputedStyle(dock).backgroundColor);
        const fg = lum(rgba(getComputedStyle(a).color));
        const b = lum(bg);
        return (Math.max(fg, b) + 0.05) / (Math.min(fg, b) + 0.05);
      });
    });
    for (const r of ratios) expect(r).toBeGreaterThanOrEqual(4.5);
  });

  test("never covers the last lines of the footer", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await expect.poll(() => dockState(page).then((s) => s.onScreen)).toBe(true);
    await page.waitForTimeout(600);
    const dockTop = (await page.locator(DOCK).boundingBox())!.y;
    const last = (await page.getByRole("contentinfo").locator("p").last().boundingBox())!;
    expect(last.y + last.height).toBeLessThanOrEqual(dockTop);
  });

  test("covered by the open mobile menu", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
    await expect.poll(() => dockState(page).then((s) => s.onScreen)).toBe(true);
    await page.getByRole("button", { name: "פתיחת תפריט" }).click();
    const dialog = page.getByRole("dialog", { name: "תפריט" });
    await expect(dialog).toBeVisible();
    const hit = await page.evaluate((sel) => {
      const r = document.querySelector(sel)!.getBoundingClientRect();
      return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('[role="dialog"]') !== null;
    }, DOCK);
    expect(hit).toBe(true);
    expect((await dockState(page)).inert).toBe(true);
  });
});

test("labels stay readable at 200% (a 195px-wide viewport)", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 195, height: 422 }, deviceScaleFactor: 2 });
  await context.addInitScript(() => sessionStorage.setItem("shc-intro-seen", "1"));
  const page = await context.newPage();
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: 3000, behavior: "instant" }));
  await page.waitForTimeout(700);
  const clipped = await page.locator(`${DOCK} a`).evaluateAll((links) =>
    links.filter((a) => a.scrollWidth > a.clientWidth + 1 || a.getBoundingClientRect().right > window.innerWidth).length,
  );
  expect(clipped).toBe(0);
  await context.close();
});

test("desktop: no dock", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/");
  await expect(page.locator(DOCK)).toBeHidden();
});

test("screenshots", async ({ page, isMobile }, info) => {
  test.skip(!isMobile, "phone only");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `test-results/screens/dock-${info.project.name}.png` });
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `test-results/screens/dock-bottom-${info.project.name}.png` });
});
