import { expect, test, type Page } from "@playwright/test";
import { setupAuthenticatedPage } from "./support/setup";

async function waitForUpOfficialRegistryReady(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Applications Registry" }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Fetching applications...")).toHaveCount(0, {
    timeout: 20_000,
  });
}

async function getRegistryTitles(page: Page) {
  return (await page.locator("tbody tr td:first-child a").allInnerTexts()).map(
    (text) => text.trim(),
  );
}

async function openUpOfficialRegistry(page: Page) {
  await page.goto("/up-official", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "IP Portfolio Overview" }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page).toHaveURL(/\/up-official$/);

  await page.goto("/up-official/application-registry", {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/up-official\/application-registry/);
  await waitForUpOfficialRegistryReady(page);
}

test.describe("up-official workflows", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedPage(page, "up-official");
  });

  test("shows the dashboard for evaluating the university IP portfolio", async ({
    page,
  }) => {
    await page.goto("/up-official", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(/\/up-official$/);
    await expect(
      page.getByRole("heading", { name: "IP Portfolio Overview" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Portfolio Status Overview" }),
    ).toBeVisible();
    await expect(page.getByText("Detailed Breakdown")).toBeVisible();
    await expect(page.getByText("Grand Total")).toBeVisible();
  });

  test("shows all applications in the registry regardless of public status", async ({
    page,
  }) => {
    await openUpOfficialRegistry(page);

    await expect(
      page.getByRole("button", { name: "Add New Application" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("cell", { name: "Solar Water Purifier" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "IRIS Brandmark" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Campus Analytics Toolkit" }).first(),
    ).toBeVisible();
  });

  test("filters registry results", async ({ page }) => {
    await openUpOfficialRegistry(page);

    await page.getByRole("button", { name: "Filter" }).click();
    await page.getByPlaceholder("Search by title...").fill("Solar");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByText('Title: "Solar"')).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Solar Water Purifier" }).first(),
    ).toBeVisible();
    await expect(page.getByText("IRIS Brandmark")).toHaveCount(0);
  });

  test("sorts the registry alphabetically by IP title", async ({ page }) => {
    await openUpOfficialRegistry(page);

    await page.getByRole("button", { name: "Updated Date" }).click();
    await page.getByRole("button", { name: "IP Title (A-Z)" }).click();

    await expect.poll(() => getRegistryTitles(page)).toEqual([
      "IRIS Brandmark",
      "Solar Water Purifier",
      "Campus Analytics Toolkit",
    ]);
  });
});
