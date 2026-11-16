import { expect, test } from "@playwright/test";

// No Supabase env in the test server: there is no session, so protected routes always bounce to sign-in.
// Real Google sign-in is not automated.

for (const path of ["/profile", "/prayers", "/collections", "/intentions"]) {
  test(`signed-out ${path} redirects to sign-in and remembers where to return`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL((url) => url.pathname === "/login" && url.searchParams.get("next") === path);
    await expect(page.getByRole("heading", { name: "Sign in", level: 1 })).toBeVisible();
  });
}

test("the redirect keeps the query string on nested paths", async ({ page }) => {
  await page.goto("/prayers/some-id?tab=notes");
  const url = new URL(page.url());
  expect(url.pathname).toBe("/login");
  expect(url.searchParams.get("next")).toBe("/prayers/some-id?tab=notes");
});

test("sign-in explains it is not configured and the Rosary stays open", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText(/Sign-in isn.t configured yet/)).toBeVisible();

  for (const path of ["/rosary", "/offline", "/login"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    expect(new URL(page.url()).pathname).toBe(path);
  }
});
