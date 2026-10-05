// @ts-check
const { test, expect } = require("@playwright/test");

const BASE_URL = process.env.BASE_URL || "https://mohamedali-maali.duckdns.org";

/**
 * E2E Test Suite — Mohamed Ali Maali Portfolio
 *
 * Contact form: The backend /api/contact endpoint gracefully handles missing
 * SMTP credentials by returning HTTP 201 with success:true and a thank-you
 * message, without sending a real email. This means the E2E test can safely
 * submit the form without spamming a real mailbox in CI.
 */

test.describe("Homepage", () => {
  test("loads successfully with correct title and status 200", async ({
    page,
  }) => {
    const response = await page.goto(BASE_URL);
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Mohamed Ali Maali/i);
  });

  test("serves HTTPS with valid certificate", async ({ page }) => {
    const response = await page.goto(BASE_URL);
    // If certificate were invalid, goto would throw — reaching here means cert OK
    expect(response?.status()).toBeLessThan(400);
    expect(page.url()).toMatch(/^https:/);
  });

  test("renders profile heading", async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for React to mount and API data to load
    await expect(
      page.locator("h1, h2").filter({ hasText: /Mohamed Ali Maali/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Backend API", () => {
  test("GET /api/health returns 200 with healthy status", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("healthy");
    expect(body.service).toBeDefined();
    expect(typeof body.uptime_seconds).toBe("number");
  });

  test("GET /api/profile returns profile data", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/profile`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBeDefined();
    expect(body.email).toBeDefined();
  });

  test("GET /api/projects returns array of projects", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/projects`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test("GET /api/skills returns skills data", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/skills`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/contact with valid data returns 201 success", async ({
    request,
  }) => {
    // Safe test: the backend returns success even without SMTP configured.
    // It logs a warning but does NOT throw or send a real email.
    const response = await request.post(`${BASE_URL}/api/contact`, {
      data: {
        name: "E2E Test Runner",
        email: "e2e-test@example.invalid",
        subject: "Automated E2E Test",
        message:
          "This is an automated E2E test submission. Please ignore.",
      },
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.received_name).toBe("E2E Test Runner");
    expect(body.message).toBeDefined();
  });

  test("POST /api/contact with missing required fields returns 422", async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/contact`, {
      data: { email: "test@example.com" }, // missing name and message
    });
    expect(response.status()).toBe(422);
  });
});

test.describe("Contact Form (UI)", () => {
  test("contact form is visible and submittable", async ({ page }) => {
    await page.goto(BASE_URL);

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Fill in the contact form
    await page.fill("#contact-name", "E2E Test Runner");
    await page.fill("#contact-email", "e2e-test@example.invalid");
    await page.fill("#contact-subject", "Automated E2E Test");
    await page.fill(
      "#contact-message",
      "This is an automated E2E test. Please ignore."
    );

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success alert appears (backend returns 201 without sending email)
    await expect(page.locator(".success-alert")).toBeVisible({ timeout: 10000 });

    // Verify form resets after success
    await expect(page.locator("#contact-name")).toHaveValue("");
  });
});

test.describe("Security Headers", () => {
  test("response includes security headers", async ({ request }) => {
    const response = await request.get(BASE_URL);
    const headers = response.headers();

    // These should be set — we verify them and document what's missing
    const strictTransport = headers["strict-transport-security"];
    const xContentType = headers["x-content-type-options"];
    const xFrame = headers["x-frame-options"];

    expect(strictTransport).toBeDefined();
    expect(xContentType).toBe("nosniff");
    expect(["DENY", "SAMEORIGIN"]).toContain(xFrame?.toUpperCase());
  });
});
