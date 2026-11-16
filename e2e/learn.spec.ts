import { expect, test } from "@playwright/test";

const GUIDES = [
  { path: "/learn/how-to-pray-the-rosary", h1: "How to pray the Rosary" },
  { path: "/learn/rosary-mysteries-by-day", h1: "Rosary mysteries by day of the week" },
  { path: "/learn/rosary-prayers", h1: "Rosary prayers: full text" },
];

const PRACTICE_GUIDES = [
  { path: "/learn/how-to-pray-the-divine-mercy-chaplet", h1: "How to pray the Divine Mercy Chaplet", cta: "/divine-mercy" },
  { path: "/learn/how-to-pray-the-angelus", h1: "How to pray the Angelus", cta: "/angelus" },
  { path: "/learn/how-to-pray-the-stations-of-the-cross", h1: "How to pray the Stations of the Cross", cta: "/stations-of-the-cross" },
];

for (const { path, h1, cta } of PRACTICE_GUIDES) {
  test(`${path} renders and links to its guided practice`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: h1, level: 1 })).toBeVisible();
    await expect(page.locator(`main a[href="${cta}"]`).first()).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path}$`));
  });
}

for (const { path, h1 } of GUIDES) {
  test(`${path} renders for a signed-out visitor and links to the guided Rosary`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { name: h1, level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open the guided Rosary" })).toHaveAttribute("href", "/rosary");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path}$`));
  });
}

test("mysteries by day lists the schedule", async ({ page }) => {
  await page.goto("/learn/rosary-mysteries-by-day");
  const thursday = page.getByRole("row", { name: /Thursday/ });
  await expect(thursday).toContainText("Luminous Mysteries");
  await expect(page.getByRole("row", { name: /Sunday/ })).toContainText("Glorious Mysteries");
});

test("prayers page has the Hail Mary text", async ({ page }) => {
  await page.goto("/learn/rosary-prayers");
  await expect(page.getByRole("heading", { name: "Hail Mary", level: 2 })).toBeVisible();
  await expect(page.getByText("Hail Mary, full of grace")).toBeVisible();
});
