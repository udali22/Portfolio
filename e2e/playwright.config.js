// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Playwright configuration for portfolio E2E tests.
 * Tests run against the live production URL by default.
 * Override BASE_URL env var for local testing.
 */
module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 1,
  workers: 1,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || "https://mohamedali-maali.duckdns.org",
    extraHTTPHeaders: {
      "User-Agent": "Playwright-E2E-Test/1.0",
    },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Ignore HTTPS errors in test environments
    ignoreHTTPSErrors: false,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
