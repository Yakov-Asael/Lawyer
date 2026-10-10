import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 03: hero and intro loader. */

const WA_GENERIC = "שלום עו״ד שוקרון כהן, אשמח להתייעץ.";

test("one h1, portrait alt, decorative seal", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  // The local search phrase opens the H1 (spec 16), as its own words, not glued to line 1.
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/^עורך דין ונוטריון בחדרה ליווי משפטי אישי\./);
  await expect(page.getByRole("img", { name: "עו״ד יוסי שוקרון כהן" })).toBeAttached();
  const hero = page.locator("section[aria-labelledby=hero-title]");
  await expect(hero.locator("[aria-hidden=true] svg").first()).toBeAttached();
});

test("hero WhatsApp opens wa.me with the generic greeting; call uses tel:", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("section[aria-labelledby=hero-title]");
  const wa = hero.getByRole("link", { name: "שלחו הודעה בוואטסאפ" });
  const url = new URL((await wa.getAttribute("href"))!);
  expect(url.origin + url.pathname).toBe("https://wa.me/972522521127");
  expect(url.searchParams.get("text")).toBe(WA_GENERIC);
  await expect(hero.getByRole("link", { name: "חיוג ל-052-252-1127" })).toHaveAttribute("href", "tel:+972522521127");
});

test("phone first viewport shows H1, sub and both contact buttons", async ({ page, isMobile }) => {
  test.skip(!isMobile, "390x844 only");
  await page.goto("/");
  const hero = page.locator("section[aria-labelledby=hero-title]");
  for (const el of [
    hero.locator("h1"),
    hero.locator("p").first(),
    hero.getByRole("link", { name: "שלחו הודעה בוואטסאפ" }),
    hero.getByRole("link", { name: "חיוג ל-052-252-1127" }),
  ]) {
    await expect(el).toBeInViewport({ ratio: 1 });
  }
});

test("desktop: text at the start (right), portrait at the end (left)", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/");
  const h1 = (await page.locator("h1").boundingBox())!;
  const img = (await page.getByRole("img", { name: "עו״ד יוסי שוקרון כהן" }).boundingBox())!;
  expect(h1.x).toBeGreaterThan(img.x + img.width - 1);
});

test("server HTML carries no revealed state, and motion is armed before hydration", async ({ page, request }) => {
  const html = await (await request.get("/")).text();
  expect(html).not.toContain("data-in=");

  await page.goto("/", { waitUntil: "commit" });
  await page.waitForFunction(() => document.readyState !== "loading");
  // Armed by the inline boot script, before React marks motion-ready.
  expect(await page.evaluate(() => document.documentElement.classList.contains("motion"))).toBe(true);
});

test.describe("intro curtain", () => {
  test.use({ intro: true });

  const curtainShown = (page: Page) =>
    page.locator(".curtain").evaluate((el) => {
      const s = getComputedStyle(el);
      return s.display !== "none" && s.visibility !== "hidden";
    });

  test("plays on the first load, leaves by itself, and not again in the session", async ({ page }) => {
    await page.goto("/");
    expect(await curtainShown(page)).toBe(true);
    await expect.poll(() => curtainShown(page), { timeout: 4000 }).toBe(false);
    await expect(page.locator("h1")).toBeInViewport();

    await page.reload();
    expect(await curtainShown(page)).toBe(false);
  });

  test("never shows with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(await curtainShown(page)).toBe(false);
  });

  test("leaves even without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect.poll(() => curtainShown(page), { timeout: 4000 }).toBe(false);
    await context.close();
  });
});

/** LCP under Lighthouse-like mobile conditions: slow 4G (1.6 Mbps, 150ms RTT) and 4x CPU slowdown. */
async function measureLcp(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(4000);
  return page.evaluate(
    () =>
      new Promise<{ time: number; element: string }>((resolve) => {
        new PerformanceObserver((list) => {
          const last = list.getEntries().at(-1) as PerformanceEntry & { element?: Element | null };
          const el = last.element;
          resolve({
            time: Math.round(last.startTime),
            element: el ? `${el.tagName.toLowerCase()} ${el.closest("h1") ? "(h1)" : ""}${el.textContent?.slice(0, 20) ?? ""}` : "?",
          });
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );
}

test.describe("LCP", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile measurement");

  // Chrome does not take elements that fade in by animation as later LCP candidates, so on repeat visits the
  // reported element is the first large text painted (the header name). The time is what the spec guards.
  test("repeat visit: LCP under 2.5s", async ({ page }) => {
    const lcp = await measureLcp(page);
    console.log("LCP repeat", lcp);
    expect(lcp.time).toBeLessThan(2500);
  });

  test.describe("first visit", () => {
    test.use({ intro: true });
    test("first visit with the curtain: LCP under 2.5s", async ({ page }) => {
      const lcp = await measureLcp(page);
      console.log("LCP first", lcp);
      expect(lcp.element).not.toMatch(/curtain/);
      expect(lcp.time).toBeLessThan(2500);
    });
  });
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `test-results/screens/hero-${info.project.name}.png` });
});
