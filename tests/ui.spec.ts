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
    favoriteOrder: null,
  },
  {
    id: "music-piper",
    title: "Music Piper",
    repoUrl: "https://github.com/Namans12/musicpipeline--best.git",
    status: "done",
    favorite: false,
    favoriteOrder: null,
  },
  {
    id: "water-blogger",
    title: "Water Blogger",
    repoUrl: "https://github.com/Namans12/water-logger.git",
    status: "done",
    favorite: false,
    favoriteOrder: null,
  },
  {
    id: "health-hub",
    title: "Health Hub",
    repoUrl: "https://github.com/Namans12/health-hub.git",
    status: "done",
    favorite: false,
    favoriteOrder: null,
  },
  {
    id: "watcher",
    title: "Watcher",
    repoUrl: "https://github.com/Namans12/watchlist.git",
    status: "done",
    favorite: false,
    favoriteOrder: null,
  },
  {
    id: "invoice-dashboard",
    title: "Invoice Dashboard",
    repoUrl: "https://github.com/your-username/invoice-dashboard",
    status: "pending",
    favorite: false,
    favoriteOrder: null,
  },
  {
    id: "cli-repo-reporter",
    title: "CLI Repo Reporter",
    repoUrl: "https://github.com/your-username/repo-reporter",
    status: "pending",
    favorite: false,
    favoriteOrder: null,
  },
  {
    id: "changelog-generator",
    title: "Changelog Generator",
    repoUrl: "https://github.com/your-username/changelog-generator",
    status: "pending",
    favorite: false,
    favoriteOrder: null,
  },
];

const dataFile = path.join(process.cwd(), "server", "data", "projects.json");

test.use({ viewport: { width: 1280, height: 900 } });

async function resetProjects() {
  await writeFile(dataFile, `${JSON.stringify(seedProjects, null, 2)}\n`, "utf8");
}

async function stabilize(page) {
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator("#project-grid")).toBeVisible();
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

  test("pending checkbox shows tick preview on hover", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    const tickbox = page.locator('.project-tickbox[data-project-id="invoice-dashboard"]');
    await tickbox.hover();
    await expect(tickbox).toHaveClass(/project-tickbox--preview/);
    await page.waitForTimeout(250);

    const preview = await tickbox.evaluate((element) => {
      const shortStroke = element.querySelector(".tick-stroke--short");
      const longStroke = element.querySelector(".tick-stroke--long");
      if (!shortStroke || !longStroke) {
        throw new Error("Missing tick stroke element");
      }

      return {
        beforeOpacity: getComputedStyle(shortStroke).opacity,
        afterOpacity: getComputedStyle(longStroke).opacity,
      };
    });

    expect(preview.beforeOpacity).toBe("1");
    expect(preview.afterOpacity).toBe("1");
  });

  test("favorite toggle and manager dialog work", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator("#open-manager-button").click();
    await expect(page.locator("#manager-modal")).toBeVisible();

    await page.locator('.manager-favorite-input[data-project-id="invoice-dashboard"]').click();
    await stabilize(page);
    await expect(page.locator('.manager-favorite-input[data-project-id="invoice-dashboard"]')).toBeChecked();

    await expect(page.locator("#project-manager-list .project-manager-row")).toHaveCount(8);
    await page.keyboard.press("Escape");
    await stabilize(page);
    await expect(page.locator(".project-card").first()).toContainText("Invoice Dashboard");
  });

  test("plus button opens add dialog while repo manager button opens manager", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator("#add-project-button").click();
    await expect(page.locator("#add-project-modal")).toBeVisible();
    await expect(page.locator("#manager-modal")).toHaveCount(0);
    await page.locator("#close-add-project-button").click();

    await page.locator("#open-manager-button").click();
    await expect(page.locator("#manager-modal")).toBeVisible();
  });

  test("projects created from plus flow appear in repo manager", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator("#add-project-button").click();
    await page.locator("#quick-project-title-input").fill("Fresh Repo");
    await page.locator("#quick-project-repo-input").fill("https://github.com/example/fresh-repo");
    await page.locator("#quick-add-project-form").getByRole("button", { name: "Save Repo" }).click();
    await stabilize(page);

    await page.locator("#open-manager-button").click();
    await expect(page.locator("#project-manager-list .project-manager-row")).toHaveCount(9);
    await expect(page.locator("#project-manager-list")).toContainText("Fresh Repo");
  });

  test("search filters visible cards", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator("#project-search-input").fill("invoice");
    await stabilize(page);
    await expect(page.locator(".project-card")).toHaveCount(1);
    await expect(page.locator(".project-card")).toContainText("Invoice Dashboard");
  });

  test("search filters on first letter and is case insensitive", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator("#project-search-input").fill("i");
    await stabilize(page);
    await expect(page.locator(".project-card")).toHaveCount(2);

    await page.locator("#project-search-input").fill("INVOICE");
    await stabilize(page);
    await expect(page.locator(".project-card")).toHaveCount(1);
    await expect(page.locator(".project-card")).toContainText("Invoice Dashboard");
  });

  test("cannot create duplicate project titles or repo urls ignoring case", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator("#add-project-button").click();
    await page.locator("#quick-project-title-input").fill("invoice dashboard");
    await page.locator("#quick-project-repo-input").fill("https://github.com/example/new-project");
    await page.locator("#quick-add-project-form").getByRole("button", { name: "Save Repo" }).click();
    await expect(page.locator("#quick-manager-feedback")).toContainText("already exists");

    await page.locator("#quick-project-title-input").fill("Fresh Project");
    await page.locator("#quick-project-repo-input").fill("https://github.com/YOUR-USERNAME/INVOICE-DASHBOARD/");
    await page.locator("#quick-add-project-form").getByRole("button", { name: "Save Repo" }).click();
    await expect(page.locator("#quick-manager-feedback")).toContainText("already exists");
  });

  test("favorites are ordered by like time", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    await page.locator('.project-favorite-toggle .checkbox[data-project-id="invoice-dashboard"]').click();
    await stabilize(page);
    await page.locator('.project-favorite-toggle .checkbox[data-project-id="cli-repo-reporter"]').click();
    await stabilize(page);

    await expect(page.locator(".project-card").nth(0)).toContainText("Invoice Dashboard");
    await expect(page.locator(".project-card").nth(1)).toContainText("CLI Repo Reporter");
  });

  test("github icon keeps the same bottom offset in pending and done cards", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    const pendingMetrics = await page.locator(".project-card").first().evaluate((card) => {
      const icon = card.querySelector(".project-github-link");
      if (!icon) {
        throw new Error("Missing pending github link");
      }

      const cardRect = card.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();

      return {
        bottomOffset: Math.round((cardRect.bottom - iconRect.bottom) * 100) / 100,
        leftOffset: Math.round((iconRect.left - cardRect.left) * 100) / 100,
      };
    });

    await page.locator("#status-toggle").click();
    await stabilize(page);

    const doneMetrics = await page.locator(".project-card").first().evaluate((card) => {
      const icon = card.querySelector(".project-github-link");
      if (!icon) {
        throw new Error("Missing done github link");
      }

      const cardRect = card.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();

      return {
        bottomOffset: Math.round((cardRect.bottom - iconRect.bottom) * 100) / 100,
        leftOffset: Math.round((iconRect.left - cardRect.left) * 100) / 100,
      };
    });

    expect(Math.abs(pendingMetrics.bottomOffset - doneMetrics.bottomOffset)).toBeLessThanOrEqual(1);
    expect(Math.abs(pendingMetrics.leftOffset - doneMetrics.leftOffset)).toBeLessThanOrEqual(1);
  });

  test("page shell does not shift horizontally when scrollbar state changes", async ({ page }) => {
    await page.goto("/");
    await stabilize(page);

    const pendingLeft = await page.locator(".hero").evaluate((element) => {
      return Math.round(element.getBoundingClientRect().left * 100) / 100;
    });

    await page.locator("#status-toggle").click();
    await stabilize(page);

    const doneLeft = await page.locator(".hero").evaluate((element) => {
      return Math.round(element.getBoundingClientRect().left * 100) / 100;
    });

    expect(Math.abs(pendingLeft - doneLeft)).toBeLessThanOrEqual(1);
  });
});
