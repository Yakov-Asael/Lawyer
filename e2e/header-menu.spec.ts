import { expect, test } from "@playwright/test";

/** Spec 02: header and mobile menu. */

test.describe("desktop header", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("brand, four links, WhatsApp and call in one row; no number text", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    const nav = header.getByRole("navigation", { name: "ניווט ראשי" });
    await expect(nav.getByRole("link")).toHaveText(["תחומי עיסוק", "אודות", "שאלות נפוצות", "הגעה למשרד"]);

    const parts = [
      header.getByRole("link", { name: /יוסי שוקרון כהן/ }),
      nav,
      header.getByRole("link", { name: "וואטסאפ" }),
      header.getByRole("link", { name: "חיוג ל-052-252-1127" }),
    ];
    const centers: number[] = [];
    for (const part of parts) {
      await expect(part).toBeVisible();
      const box = (await part.boundingBox())!;
      centers.push(box.y + box.height / 2);
    }
    expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(12);

    await expect(header.getByRole("button", { name: "פתיחת תפריט" })).toBeHidden();
    await expect(header).not.toContainText("052-252-1127");
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "phone only");

  test("only brand and burger in the header", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: /יוסי שוקרון כהן/ })).toBeVisible();
    await expect(header.getByRole("button", { name: "פתיחת תפריט" })).toBeVisible();
    await expect(header.getByRole("navigation")).toBeHidden();
    await expect(header.getByRole("link", { name: "וואטסאפ" })).toBeHidden();
  });

  test("opens with focus on the first link; Esc closes and refocuses the burger", async ({ page }) => {
    await page.goto("/");
    const burger = page.getByRole("button", { name: "פתיחת תפריט" });
    await burger.click();

    const dialog = page.getByRole("dialog", { name: "תפריט" });
    await expect(dialog).toBeVisible();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await expect(dialog.getByRole("link", { name: "תחומי עיסוק" })).toBeFocused();
    await expect(page.locator("html")).toHaveClass(/menu-lock/);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(burger).toBeFocused();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("html")).not.toHaveClass(/menu-lock/);
  });

  test("Tab cannot reach page content while the menu is open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "פתיחת תפריט" }).click();
    const dialog = page.getByRole("dialog", { name: "תפריט" });
    await expect(dialog.getByRole("link", { name: "תחומי עיסוק" })).toBeFocused();

    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const el = document.activeElement;
        return !el || el === document.body || !!el.closest('[role="dialog"]');
      });
      expect(inside, `tab stop ${i + 1}`).toBe(true);
    }
  });

  test("menu footer offers WhatsApp and call, full width", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "פתיחת תפריט" }).click();
    const dialog = page.getByRole("dialog", { name: "תפריט" });
    await expect(dialog.getByRole("link", { name: "שלחו הודעה בוואטסאפ" })).toHaveAttribute("href", /^https:\/\/wa\.me\/972522521127\?text=/);
    await expect(dialog.getByRole("link", { name: "חיוג ל-052-252-1127" })).toHaveAttribute("href", "tel:+972522521127");
  });

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`a menu link closes the menu and lands on the section (${reducedMotion})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto("/");
      await page.getByRole("button", { name: "פתיחת תפריט" }).click();
      const dialog = page.getByRole("dialog", { name: "תפריט" });
      await dialog.getByRole("link", { name: "הגעה למשרד" }).click();

      await expect(dialog).toBeHidden();
      const target = page.locator("#visit");
      await expect(target).toBeFocused();
      // Lands at the top of the viewport, or as far as the page can scroll when the section is near the end.
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const top = document.getElementById("visit")!.getBoundingClientRect().top;
              const atEnd = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 1;
              return top < 40 || (atEnd && top < window.innerHeight);
            }),
          { timeout: 5000 },
        )
        .toBe(true);
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      expect(new URL(page.url()).hash).toBe("#visit");
    });
  }

  test("screenshot of the open menu", async ({ page }, info) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole("button", { name: "פתיחת תפריט" }).click();
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `test-results/screens/menu-${info.project.name}.png` });
  });
});

test("close button's X is centered in its circle", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  await page.goto("/");
  await page.getByRole("button", { name: "פתיחת תפריט" }).click();
  const close = page.getByRole("button", { name: "סגירת תפריט" });
  await expect(close).toBeVisible();
  const offset = await close.evaluate((el) => {
    const bar = getComputedStyle(el, "::before");
    // inset:0 + margin:auto resolves both margins to the free space; centred when they are equal halves.
    const free = el.clientWidth - parseFloat(bar.width); // padding box: the pseudo-element's containing block
    return Math.max(Math.abs(parseFloat(bar.marginLeft) - free / 2), Math.abs(parseFloat(bar.marginRight) - free / 2));
  });
  expect(offset).toBeLessThanOrEqual(0.5);
});
