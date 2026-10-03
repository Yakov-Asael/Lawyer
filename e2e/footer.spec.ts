import { expect, test } from "./fixtures";

/** Spec 13: footer. */

const LINKS = [
  ["תחומי עיסוק", "/#areas"],
  ["אודות", "/#about"],
  ["שאלות נפוצות", "/#faq"],
  ["הגעה למשרד", "/#visit"],
  ["תקנון האתר", "/terms"],
  ["הצהרת נגישות", "/accessibility-statement"],
  ["מדיניות פרטיות", "/privacy-policy"],
] as const;

test("contentinfo landmark with seal, name, tagline and the build year", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toHaveCount(1);
  await expect(footer.locator("svg").first()).toHaveAttribute("aria-hidden", "true");
  await expect(footer).toContainText("עו״ד יוסי שוקרון כהן");
  await expect(footer).toContainText("עורך דין ונוטריון · הרברט סמואל 27, חדרה");
  await expect(footer).toContainText(`© ${new Date().getFullYear()} עו״ד יוסי שוקרון כהן. המידע באתר אינו מהווה ייעוץ משפטי.`);
});

test("icon links: labelled, at least 44px, correct targets", async ({ page }) => {
  await page.goto("/");
  const icons = page.getByRole("contentinfo").locator("a[aria-label]");
  await expect(icons).toHaveCount(4);
  const data = await icons.evaluateAll((links) =>
    links.map((a) => {
      const r = a.getBoundingClientRect();
      return { label: a.getAttribute("aria-label"), href: a.getAttribute("href")!, w: r.width, h: r.height, target: a.getAttribute("target") };
    }),
  );
  expect(data.map((d) => d.label)).toEqual(["וואטסאפ", "חיוג ל-052-252-1127", "ניווט למשרד ב-Waze", "המשרד ב-Google Maps"]);
  expect(data[0]!.href).toMatch(/^https:\/\/wa\.me\/972522521127\?text=/);
  expect(data[1]!.href).toBe("tel:+972522521127");
  expect(data[2]!.href).toMatch(/^https:\/\/waze\.com\/ul\?/);
  expect(data[3]!.href).toMatch(/^https:\/\/www\.google\.com\/maps\/search\//);
  for (const d of data) {
    expect(d.w).toBeGreaterThanOrEqual(44);
    expect(d.h).toBeGreaterThanOrEqual(44);
    expect(d.target).toBe("_blank");
  }
});

test("links from content; no reviews link while there are no reviews", async ({ page }) => {
  await page.goto("/");
  const links = page.getByRole("contentinfo").locator("ul").nth(1).getByRole("link");
  await expect(links).toHaveText(LINKS.map(([label]) => label));
  for (const [i, [, href]] of LINKS.entries()) await expect(links.nth(i)).toHaveAttribute("href", href);
});

test("no line of links starts with a separator; dots only on one desktop line", async ({ page, isMobile }) => {
  await page.goto("/");
  const dots = await page
    .getByRole("contentinfo")
    .locator("ul")
    .nth(1)
    .locator("li")
    .evaluateAll((items) => items.map((li) => getComputedStyle(li, "::before").content));
  if (isMobile) {
    expect(dots.every((c) => c === "none" || c === "normal")).toBe(true);
  } else {
    expect(dots[0]).toMatch(/none|normal/);
    expect(dots.slice(1).every((c) => c === '""')).toBe(true);
    // All on one line, so no line can start with a dot.
    const rows = await page.getByRole("contentinfo").locator("ul").nth(1).locator("li").evaluateAll((items) =>
      new Set(items.map((li) => Math.round(li.getBoundingClientRect().top))).size,
    );
    expect(rows).toBe(1);
  }
});

test("a footer section link scrolls on the same page and moves focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "שאלות נפוצות" }).click();
  await expect(page.locator("#faq")).toBeFocused();
  expect(new URL(page.url()).hash).toBe("#faq");
});

test("phones: the footer clears the space reserved for the contact dock", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(300);
  const lastLine = await page.getByRole("contentinfo").locator("p").last().boundingBox();
  const vh = page.viewportSize()!.height;
  expect(lastLine!.y + lastLine!.height).toBeLessThanOrEqual(vh - 84);
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.getByRole("contentinfo").screenshot({ path: `test-results/screens/footer-${info.project.name}.png` });
});
