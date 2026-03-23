import { expect, test } from "@playwright/test";
import { setupAuthenticatedPage } from "./support/setup";

test.describe("up-official workflows", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedPage(page, "up-official");
  });

  test("shows the dashboard and read-only registry", async ({ page }) => {
    await page.goto("/up-official");
    await expect(
      page.getByRole("heading", { name: "IP Portfolio Overview" }),
    ).toBeVisible();

    await page.goto("/up-official/application-registry");
    await expect(
      page.getByRole("heading", { name: "Applications Registry" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add New Application" }),
    ).toHaveCount(0);

    await page.getByRole("button", { name: "Filter" }).click();
    await page.getByPlaceholder("Search by title...").fill("IRIS");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByRole("cell", { name: "IRIS Brandmark" })).toBeVisible();
    await expect(page.getByText("Solar Water Purifier")).toHaveCount(0);
  });
});
