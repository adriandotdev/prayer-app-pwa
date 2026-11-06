import { expect, test, type Page } from "@playwright/test";

// The service worker registers in production only, so these run against `next start` (see playwright.config.ts).

async function waitForOfflineReady(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // Install precaches /offline and /rosary; wait until both are really in a cache.
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const urls = new Set<string>();
          for (const name of await caches.keys()) {
            if (!name.startsWith("ora-")) continue;
            for (const req of await (await caches.open(name)).keys()) urls.add(new URL(req.url).pathname);
          }
          return ["/offline", "/rosary"].every((p) => urls.has(p));
        }),
      { timeout: 30_000, message: "service worker should precache /offline and /rosary" },
    )
    .toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/rosary");
  await waitForOfflineReady(page);
  // Reload so the page is controlled by the (now active) service worker.
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
});

test("an uncached page falls back to the offline screen, which links back to the Rosary", async ({ page, context }) => {
  await context.setOffline(true);

  await page.goto("/terms").catch(() => {
    /* the SW answers with /offline; a failed navigation would show here */
  });
  await expect(page.getByRole("heading", { name: "You are offline" })).toBeVisible();

  await page.getByRole("link", { name: "Open the Rosary" }).click();
  await expect(page).toHaveURL(/\/rosary$/);
  await expect(page.getByRole("heading", { name: "The Rosary", level: 1 })).toBeVisible();
});

test("the Rosary still works offline and shows the offline banner", async ({ page, context }) => {
  await context.setOffline(true);
  await page.reload();

  await expect(page.getByRole("heading", { name: "The Rosary", level: 1 })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: /You.re offline/ })).toBeVisible();

  await page.getByRole("radio", { name: /Joyful/ }).click();
  await page.getByRole("button", { name: /^(Begin in )?Pray( mode)?$/ }).click();
  await page.getByRole("button", { name: /Next/ }).click();
  await expect(page.getByRole("status").filter({ hasText: /step 2 of 80/ })).toBeVisible();

  await context.setOffline(false);
  await expect(page.getByRole("status").filter({ hasText: /You.re offline/ })).toBeHidden();
});
