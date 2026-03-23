import { expect, test } from "@playwright/test";
import { setupAuthenticatedPage, setupGuestPage } from "./support/setup";

test.describe("role-based routing", () => {
  test("redirects unauthenticated users away from protected pages", async ({
    page,
  }) => {
    await setupGuestPage(page);
    await page.goto("/admin");

    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "IP Portfolio Overview" }),
    ).toBeVisible();
  });

  test("keeps admins inside admin routes", async ({ page }) => {
    await setupAuthenticatedPage(page, "admin");

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto("/techgen/application-registry");
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("keeps techgens inside techgen routes", async ({ page }) => {
    await setupAuthenticatedPage(page, "techgen");

    await page.goto("/techgen");
    await expect(page).toHaveURL(/\/techgen$/);

    await page.goto("/admin/application-registry");
    await expect(page).toHaveURL(/\/techgen$/);
  });

  test("keeps up officials inside up-official routes", async ({ page }) => {
    await setupAuthenticatedPage(page, "up-official");

    await page.goto("/up-official");
    await expect(page).toHaveURL(/\/up-official$/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/up-official$/);
  });
});
