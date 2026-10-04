import { expect, test } from "./fixtures";

/** Finish pass: guards for the audit fixes (bundle weight, tap targets). */

test("client JavaScript carries no Zod: content is validated on the server only", async ({ page }) => {
  const bodies: Promise<string>[] = [];
  page.on("response", (r) => {
    if (r.url().includes("/_next/static/") && r.url().endsWith(".js")) bodies.push(r.text().catch(() => ""));
  });
  for (const path of ["/", "/terms", "/review"]) await page.goto(path, { waitUntil: "networkidle" });
  const js = await Promise.all(bodies);
  expect(js.length).toBeGreaterThan(0);
  expect(js.filter((b) => b.includes("ZodError"))).toHaveLength(0);
});

test("footer, header and brand links are at least 44px tall", async ({ page, isMobile }) => {
  await page.goto("/");
  const heights = async (selector: string) =>
    page.locator(selector).evaluateAll((els) =>
      els.filter((el) => (el as HTMLElement).offsetParent !== null).map((el) => Math.round(el.getBoundingClientRect().height)),
    );
  const footer = await heights("footer ul:nth-of-type(2) a");
  expect(footer.length).toBeGreaterThan(0);
  for (const h of footer) expect(h).toBeGreaterThanOrEqual(44);
  for (const h of await heights("header > a")) expect(h).toBeGreaterThanOrEqual(44);
  if (!isMobile) for (const h of await heights("header nav a")) expect(h).toBeGreaterThanOrEqual(44);
});

test("phones: at the bottom of the page, the floating buttons cover no footer text", async ({ page, isMobile }) => {
  test.skip(!isMobile, "the dock and its clearance exist below 900px");
  await page.goto("/terms");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(600);
  const overlaps = await page.evaluate(() => {
    const floating = [document.querySelector('button[aria-label="תפריט נגישות"]'), document.querySelector("nav[data-shown]")]
      .filter(Boolean)
      .map((el) => el!.getBoundingClientRect());
    const hits = [...document.querySelectorAll("footer p, footer a")]
      .map((el) => ({ text: el.textContent!.trim().slice(0, 20), r: el.getBoundingClientRect() }))
      .filter(({ r }) => floating.some((f) => r.left < f.right && r.right > f.left && r.top < f.bottom && r.bottom > f.top))
      .map(({ text }) => text);
    return { floating: floating.length, hits };
  });
  expect(overlaps.floating).toBe(2);
  expect(overlaps.hits).toEqual([]);
});
