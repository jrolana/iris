import path from "node:path";
import { expect, test } from "@playwright/test";
import { setupAuthenticatedPage } from "./support/setup";

const uploadFixture = path.join(
  process.cwd(),
  "tests",
  "fixtures",
  "sample-upload.pdf",
);

test.describe("techgen workflows", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedPage(page, "techgen");
  });

  test("shows the techgen dashboard status history", async ({ page }) => {
    await page.goto("/techgen");

    await expect(page.getByText("Status history")).toBeVisible();
    await expect(page.getByText("Solar Water Purifier")).toBeVisible();
    await expect(page.getByText("IRIS Brandmark")).toBeVisible();
  });

  test("creates a new application from the direct selection flow", async ({
    page,
  }) => {
    await page.goto("/techgen/new-application");

    await page.getByRole("button", { name: "No, I already know what to choose" }).click();
    await page.getByRole("button", { name: "Patent" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Proceed to application" }).click();

    await expect(page).toHaveURL(/\/techgen\/start-application\?ipType=patent/);

    await page
      .getByPlaceholder(
        "e.g., A study on the effectiveness of IRIS in managing intellectual property",
      )
      .fill("AI-powered Reef Monitoring");

    await page.getByRole("button", { name: "List technology generator collaborators" }).click();
    await expect(page.getByText("Add Technology Generator")).toBeVisible();

    await page
      .getByPlaceholder("Search with their name or email...")
      .fill("jrolana");
    await expect(page.getByText("jrolana", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Add Verified" }).click();

    await expect(page.getByText("jrolana@up.edu.ph")).toBeVisible();

    await page.locator('input[type="file"]').setInputFiles(uploadFixture);
    await expect(page.getByText("sample-upload.pdf")).toBeVisible();

    await page.getByRole("button", { name: "Submit Application" }).click();

    await expect(page).toHaveURL(/\/techgen\/view-application\?applicationID=app-4/);
    await expect(page.getByText("AI-powered Reef Monitoring")).toBeVisible();
    await expect(page.getByText("Reminders")).toBeVisible();

    await page.getByRole("button", { name: "Tech Gens" }).click();
    await expect(page.getByText("jrolana", { exact: true }).last()).toBeVisible();
  });
});
