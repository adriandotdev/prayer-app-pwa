import { expect, test, type Page } from "@playwright/test";

const PROGRESS_KEY = "ora:progress:v1";
const STEPS = 80;

// "Learn"/"Pray" on a phone, "Begin in Learn mode"/"Begin in Pray mode" from the sm breakpoint up.
const beginPray = (page: Page) => page.getByRole("button", { name: /^(Begin in )?Pray( mode)?$/ });
const status = (page: Page) => page.getByRole("status").filter({ hasText: /step \d+ of/ });

async function seedProgress(page: Page, index: number, mode: "learn" | "pray" = "pray") {
  await page.evaluate(
    ([key, value]) => localStorage.setItem(key, value),
    [PROGRESS_KEY, JSON.stringify({ sequenceId: "rosary:joyful", index, mode, completed: false, updatedAt: Date.now() })],
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto("/rosary");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("home offers the four mystery sets and moves the choice with arrow keys", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "The Rosary", level: 1 })).toBeVisible();

  const radios = page.getByRole("radio");
  await expect(radios).toHaveCount(4);
  await expect(radios.filter({ hasText: "Joyful" })).toBeVisible();
  await expect(radios.filter({ hasText: "Sorrowful" })).toBeVisible();
  await expect(radios.filter({ hasText: "Glorious" })).toBeVisible();
  await expect(radios.filter({ hasText: "Luminous" })).toBeVisible();

  const joyful = radios.filter({ hasText: "Joyful" });
  const sorrowful = radios.filter({ hasText: "Sorrowful" });
  await joyful.click();
  await expect(joyful).toHaveAttribute("aria-checked", "true");

  await joyful.press("ArrowRight");
  await expect(sorrowful).toHaveAttribute("aria-checked", "true");
  await expect(sorrowful).toBeFocused();
  await expect(joyful).toHaveAttribute("aria-checked", "false");
});

test("steps through the prayers with the buttons and the keyboard", async ({ page }) => {
  await page.getByRole("radio", { name: /Joyful/ }).click();
  await beginPray(page).click();

  await expect(status(page)).toHaveText(new RegExp(`step 1 of ${STEPS}$`));
  await expect(page.getByRole("button", { name: /Back/ })).toBeDisabled();
  await expect(page.getByRole("group", { name: /^Bead tracker\. Currently on .*step 1 of 80/ })).toBeVisible();

  await page.getByRole("button", { name: /Next/ }).click();
  await expect(status(page)).toHaveText(new RegExp(`step 2 of ${STEPS}$`));
  await expect(page.getByRole("button", { name: /Back/ })).toBeEnabled();

  await page.keyboard.press("ArrowRight");
  await expect(status(page)).toHaveText(new RegExp(`step 3 of ${STEPS}$`));
  await page.keyboard.press("ArrowLeft");
  await expect(status(page)).toHaveText(new RegExp(`step 2 of ${STEPS}$`));

  await expect(page.getByRole("button", { name: /current$/ })).toHaveAttribute("aria-current", "step");
});

test("toggles between Learn and Pray", async ({ page }) => {
  await page.getByRole("radio", { name: /Joyful/ }).click();
  await beginPray(page).click();

  const mode = page.getByRole("group", { name: "Mode" });
  await expect(mode.getByRole("button", { name: "Pray" })).toHaveAttribute("aria-pressed", "true");
  await mode.getByRole("button", { name: "Learn" }).click();
  await expect(mode.getByRole("button", { name: "Learn" })).toHaveAttribute("aria-pressed", "true");
  await expect(mode.getByRole("button", { name: "Pray" })).toHaveAttribute("aria-pressed", "false");
});

test("offers to resume after leaving and again after a reload", async ({ page }) => {
  await page.getByRole("radio", { name: /Joyful/ }).click();
  await beginPray(page).click();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(status(page)).toHaveText(new RegExp(`step 3 of ${STEPS}$`));

  await page.getByRole("button", { name: "Leave" }).click();
  await expect(page.getByRole("heading", { name: "Continue where you left off" })).toBeVisible();
  await expect(page.getByText(/step 3 of 80/)).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Continue where you left off" })).toBeVisible();
  await page.getByRole("button", { name: "Resume" }).click();
  await expect(status(page)).toHaveText(new RegExp(`step 3 of ${STEPS}$`));
});

test("Start over clears the saved place", async ({ page }) => {
  await page.goto("/rosary");
  await seedProgress(page, 10);
  await page.reload();

  await expect(page.getByRole("heading", { name: "Continue where you left off" })).toBeVisible();
  await page.getByRole("button", { name: "Start over" }).click();
  await expect(page.getByRole("heading", { name: "Continue where you left off" })).toBeHidden();
  expect(await page.evaluate((k) => localStorage.getItem(k), PROGRESS_KEY)).toBeNull();
});

test("finishing shows Amen even with no account, then Return clears progress", async ({ page }) => {
  await page.goto("/rosary");
  await seedProgress(page, STEPS - 2);
  await page.reload();
  await page.getByRole("button", { name: "Resume" }).click();

  await expect(status(page)).toHaveText(new RegExp(`step ${STEPS - 1} of ${STEPS}$`));
  await page.getByRole("button", { name: /Next/ }).click();
  await expect(status(page)).toHaveText(new RegExp(`step ${STEPS} of ${STEPS}$`));

  await page.getByRole("button", { name: /Finish/ }).click();
  const amen = page.getByRole("heading", { name: "Amen." });
  await expect(amen).toBeVisible();
  await expect(amen).toBeFocused();
  await expect(page.getByText(/You have finished the Joyful Mysteries/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Pray the Divine Mercy Chaplet" })).toHaveAttribute("href", "/divine-mercy");

  await page.getByRole("button", { name: "Return" }).click();
  await expect(page.getByRole("heading", { name: "Choose the mysteries" })).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), PROGRESS_KEY)).toBeNull();
});
