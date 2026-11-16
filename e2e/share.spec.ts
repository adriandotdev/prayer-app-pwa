import { expect, test } from "@playwright/test";

// Supabase is unset in this suite, so no real link resolves. These cover what must hold regardless:
// a share URL is public (no sign-in redirect), never indexable, and an unknown token shows the
// not-available page. (The status stays 200 because the root loading boundary streams the response.)

const UNKNOWN = "0123456789abcdef0123456789abcdef";

test("an unknown share link shows the not-available page without asking to sign in", async ({ page }) => {
  await page.goto(`/s/${UNKNOWN}`);
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: /this link isn’t available/i })).toBeVisible();
});

test("a malformed token shows the same page", async ({ page }) => {
  await page.goto("/s/not-a-token");
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: /this link isn’t available/i })).toBeVisible();
});

test("share pages are noindex and robots disallow them", async ({ page, request }) => {
  await page.goto(`/s/${UNKNOWN}`);
  const robotsTags = await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((el) => el.getAttribute("content") ?? ""));
  expect(robotsTags.length).toBeGreaterThan(0);
  for (const content of robotsTags) expect(content).toMatch(/noindex/);

  // robots.txt is "Disallow: /" when indexing is off (as in this suite), which also covers /s/.
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \//);
});
