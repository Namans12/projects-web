import { test, expect } from "@playwright/test";

// Set consistent viewport for all tests
test.use({ viewport: { width: 1280, height: 800 } });

// Helper to stabilize UI before assertions/screenshots
async function stabilize(page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300); // allow animations to finish
}

test.describe("UI Visual Tests", () => {
  test("Light mode - homepage", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await stabilize(page);

    await expect(page).toHaveScreenshot("light-mode.png");
  });

  test("Dark mode toggle works", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const toggle = page.locator("#theme-toggle");

    await toggle.click();

    await stabilize(page);

    await expect(page).toHaveScreenshot("dark-mode.png");
  });

  test("Theme persists after reload", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const toggle = page.locator("#theme-toggle");

    await toggle.click();
    await stabilize(page);

    await page.reload();
    await stabilize(page);

    await expect(toggle).toBeChecked();
  });

  test("Project cards visible", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await stabilize(page);

    const cards = page.locator(".project-card");

    await expect(cards).toHaveCount(3);
  });
});