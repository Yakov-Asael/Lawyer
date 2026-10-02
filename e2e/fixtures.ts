import { test as base } from "@playwright/test";

/**
 * Shared test setup. The intro curtain (spec 03) covers the page for ~2.25s on the first load of a session;
 * tests that are not about the curtain start as a repeat visit. Opt in with `test.use({ intro: true })`.
 */
export const test = base.extend<{ intro: boolean }>({
  intro: [false, { option: true }],
  page: async ({ page, intro }, provide) => {
    if (!intro) await page.addInitScript(() => sessionStorage.setItem("shc-intro-seen", "1"));
    await provide(page);
  },
});

export { expect } from "@playwright/test";
