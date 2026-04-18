import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const seedProjects = [
  {
    id: "video-analyzer",
    title: "Video Analyzer",
    repoUrl: "https://github.com/Namans12/4K-Videolyzer-2.git",
    status: "done",
    favorite: false,
  },
  {
    id: "music-piper",
    title: "Music Piper",
    repoUrl: "https://github.com/Namans12/musicpipeline--best.git",
    status: "done",
    favorite: false,
  },
  {
    id: "water-blogger",
    title: "Water Blogger",
    repoUrl: "https://github.com/Namans12/water-logger.git",
    status: "done",
    favorite: false,
  },
  {
    id: "health-hub",
    title: "Health Hub",
    repoUrl: "https://github.com/Namans12/health-hub.git",
    status: "done",
    favorite: false,
  },
  {
    id: "watcher",
    title: "Watcher",
    repoUrl: "https://github.com/Namans12/watchlist.git",
    status: "done",
    favorite: false,
  },
  {
    id: "invoice-dashboard",
    title: "Invoice Dashboard",
    repoUrl: "https://github.com/your-username/invoice-dashboard",
    status: "pending",
    favorite: false,
  },
  {
    id: "cli-repo-reporter",
    title: "CLI Repo Reporter",
    repoUrl: "https://github.com/your-username/repo-reporter",
    status: "pending",
    favorite: false,
  },
  {
    id: "changelog-generator",
    title: "Changelog Generator",
    repoUrl: "https://github.com/your-username/changelog-generator",
    status: "pending",
    favorite: false,
  },
];

const dataFile = path.join(process.cwd(), "server", "data", "projects.json");

test.use({ viewport: { width: 1280, height: 900 } });

async function resetProjects() {
  await writeFile(dataFile, `${JSON.stringify(seedProjects, null, 2)}\n`, "utf8");
}

async function stabilize(page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300);
}

test.beforeEach(async () => {
  await resetProjects();
});

test.describe("Projects UI", () => {
  test("loads pending view with three cards and plain github links", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await expect(page.locator(".project-card")).toHaveCount(3);
    await expect(page.locator(".project-github-link")).toHaveCount(3);
    await expect(page.locator(".project-tickbox")).toHaveCount(3);
    await expect(page.locator("#open-manager-button")).toBeVisible();
  });

  test("theme toggle persists after reload", async ({ page }) => {
    await page.goto("/");

    const toggle = page.locator("#theme-toggle");
    await toggle.click();
    await stabilize(page);
    await expect(page.locator("body")).toHaveClass(/dark/);

    await page.reload();
    await stabilize(page);
    await expect(toggle).toBeChecked();
  });

  test("pending card confirmation moves project to done", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator('.project-tickbox[data-project-id="invoice-dashboard"]').click();
    await expect(page.locator("#done-confirm-modal")).toBeVisible();
    await page.locator("#confirm-done-yes").click();
    await stabilize(page);

    await expect(page.locator(".project-card")).toHaveCount(2);
    await page.locator("#status-toggle").click();
    await stabilize(page);
    await expect(page.locator(".project-card")).toHaveCount(6);
  });

  test("pending card confirmation can be cancelled", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator('.project-tickbox[data-project-id="invoice-dashboard"]').click();
    await expect(page.locator("#done-confirm-modal")).toBeVisible();
    await page.locator("#confirm-done-no").click();
    await stabilize(page);

    await expect(page.locator(".project-card")).toHaveCount(3);
  });

  test("favorite toggle and manager dialog work", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator("#open-manager-button").click();
    await expect(page.locator("#manager-modal")).toBeVisible();

    await page.locator('.manager-favorite-input[data-project-id="invoice-dashboard"]').check();
    await stabilize(page);
    await expect(page.locator('.manager-favorite-input[data-project-id="invoice-dashboard"]')).toBeChecked();

    await expect(page.locator("#project-manager-list .project-manager-row")).toHaveCount(8);
    await page.keyboard.press("Escape");
    await stabilize(page);
    await expect(page.locator(".project-card").first()).toContainText("Invoice Dashboard");
  });

  test("search filters visible cards", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator("#project-search-input").fill("invoice");
    await stabilize(page);
    await expect(page.locator(".project-card")).toHaveCount(1);
    await expect(page.locator(".project-card")).toContainText("Invoice Dashboard");
  });
});
