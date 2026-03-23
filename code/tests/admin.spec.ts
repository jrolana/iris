import { expect, test } from "@playwright/test";
import { setupAuthenticatedPage } from "./support/setup";

test.describe("admin workflows", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedPage(page, "admin");
  });

  test("loads the dashboard and lets admins clear unread notifications", async ({
    page,
  }) => {
    await page.goto("/admin");

    await expect(
      page.getByRole("heading", { name: "IP Portfolio Overview" }),
    ).toBeVisible();

    await page.getByLabel("Open notifications").click();
    await expect(
      page.getByRole("heading", { name: "Notifications" }),
    ).toBeVisible();
    await expect(page.getByText("Techgen reply received")).toBeVisible();

    await page.getByRole("button", { name: "View All Notifications" }).click();
    await expect(page).toHaveURL("/admin/notifications");
    await expect(
      page.getByRole("heading", { name: "Notifications" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Mark all as read" }).click();
    await expect(page.getByText("All caught up")).toBeVisible();
  });

  test("filters user management results", async ({ page }) => {
    await page.goto("/admin/user-management");

    await expect(
      page.getByRole("heading", { name: "User Management" }).first(),
    ).toBeVisible();

    await page.getByRole("button", { name: "Filter" }).first().click();
    await page
      .getByPlaceholder("Search by name or email...")
      .first()
      .fill("ttbdo.iris@gmail.com");
    await page.getByRole("button", { name: "Apply Filters" }).first().click();

    await expect(page.getByText('Name/Email: "ttbdo.iris@gmail.com"')).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "ttbdo.iris@gmail.com" }),
    ).toBeVisible();
    await expect(page.getByText("techgen.iris@gmail.com")).toHaveCount(0);
    await expect(page.getByText("User Registration Requests")).toBeVisible();
  });

  test("filters the application registry and supports withdraw flow in the detail page", async ({
    page,
  }) => {
    await page.goto("/admin/application-registry");

    await page.getByRole("button", { name: "Filter" }).click();
    await page.getByPlaceholder("Search by title...").fill("Solar");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(
      page.getByRole("cell", { name: "Solar Water Purifier" }).first(),
    ).toBeVisible();
    await page.goto("/admin/view-application?applicationID=app-1");

    await expect(page).toHaveURL(/applicationID=app-1/);
    await expect(
      page.getByText("Solar Water Purifier", { exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByText("TTBDO is reviewing the disclosure packet.")).toBeVisible();

    await page.getByRole("button", { name: "Withdraw" }).click();
    await expect(page.getByRole("button", { name: "Revert Withdrawal" })).toBeVisible();
  });
});
