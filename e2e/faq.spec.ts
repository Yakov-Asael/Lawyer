import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 10: FAQ. */

const QUESTIONS = [
  "איך קובעים פגישה?",
  "כמה עולה פגישת הייעוץ הראשונה?",
  "מה כדאי להביא לפגישה?",
  "האם מה שאני מספר בפגישה נשאר חסוי?",
  "אפשר לקבל אישור נוטריוני בלי תיק במשרד?",
  "האם המשרד מטפל בלקוחות מחוץ לחדרה?",
];

/** Expanded state of a question as Chromium exposes it to assistive tech (the native summary control). */
async function axExpanded(page: Page, question: string) {
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send("Accessibility.getFullAXTree");
  const node = nodes.find((n) => n.name?.value === question && n.role?.value === "DisclosureTriangle");
  const prop = (name: string) => node?.properties?.find((p) => p.name === name)?.value?.value;
  return { found: !!node, expanded: prop("expanded"), focusable: prop("focusable") };
}

test("questions from content (previews show unanswered ones too)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#faq-title")).toHaveText("לפני שפונים.");
  await expect(page.locator("#faq summary")).toHaveText(QUESTIONS);
});

test("each question is a keyboard control with the right expanded state", async ({ page }) => {
  await page.goto("/");
  const q = QUESTIONS[0]!;
  expect(await axExpanded(page, q)).toEqual({ found: true, expanded: false, focusable: true });
  const summary = page.locator("#faq summary", { hasText: q });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#faq details").first()).toHaveAttribute("open", "");
  expect((await axExpanded(page, q)).expanded).toBe(true);
  await page.keyboard.press("Space");
  await expect(page.locator("#faq details").first()).not.toHaveAttribute("open", "");
});

test("several items stay open at once; the toggle turns into a filled minus", async ({ page }) => {
  await page.goto("/");
  const summaries = page.locator("#faq summary");
  await summaries.nth(0).click();
  await summaries.nth(3).click();
  await expect(page.locator("#faq details[open]")).toHaveCount(2);
  const toggle = summaries.nth(0).locator("span[aria-hidden]");
  await expect.poll(() => toggle.evaluate((el) => getComputedStyle(el, "::after").transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  // Polled: the fill is a 300ms background transition, so a single read under load can land mid-way.
  await expect
    .poll(() =>
      toggle.evaluate((el) => {
        const probe = document.createElement("i");
        probe.style.color = "var(--ink)";
        document.body.append(probe);
        const want = getComputedStyle(probe).color;
        probe.remove();
        return getComputedStyle(el).backgroundColor === want;
      }),
    )
    .toBe(true);
});

test("the phone number in an answer is an isolated LTR run", async ({ page }) => {
  await page.goto("/");
  await page.locator("#faq summary").first().click();
  await expect(page.locator("#faq details").first().locator(".num")).toHaveText("052-252-1127");
});

test("JSON-LD questions match the visible questions exactly", async ({ page }) => {
  await page.goto("/");
  const ld = JSON.parse((await page.locator('#faq script[type="application/ld+json"]').textContent())!);
  expect(ld["@type"]).toBe("FAQPage");
  expect(ld.mainEntity.map((q: { name: string }) => q.name)).toEqual(await page.locator("#faq summary").allTextContents());
});

test("works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  // Without JS there is no session check, so the intro curtain plays first; wait for it to leave like a visitor would.
  await expect
    .poll(() => page.locator(".curtain").evaluate((el) => getComputedStyle(el).visibility), { timeout: 5000 })
    .toBe("hidden");
  await page.locator("#faq summary").first().click();
  await expect(page.locator("#faq details").first()).toHaveAttribute("open", "");
  await context.close();
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.locator("#faq summary").first().click();
  await page.waitForTimeout(1300);
  await page.locator("#faq").screenshot({ path: `test-results/screens/faq-${info.project.name}.png` });
});
