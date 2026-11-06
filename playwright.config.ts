import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const CI = !!process.env.CI;

// Tests run against a production build because the service worker registers in production only.
// Supabase env is deliberately left unset: the Rosary, /offline, /login and the signed-out redirects
// all work without it, so no secrets are needed.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  // CI shards the run: each shard writes a blob report and a final job merges them into one HTML report.
  reporter: CI ? [["github"], ["blob"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 240_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    },
  },
});
