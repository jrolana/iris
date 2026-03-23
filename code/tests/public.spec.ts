import { expect, test } from "@playwright/test";
import { setupGuestPage } from "./support/setup";

test.describe("public experience", () => {
  test.beforeEach(async ({ page }) => {
    await setupGuestPage(page);
  });

  test("shows the public dashboard, guide, documents, and registry", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "IP Portfolio Overview" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign-up/Log-in" }),
    ).toBeVisible();

    await page.goto("/application-guide");
    await expect(
      page.getByRole("heading", { name: "Application Guide" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Steps to apply" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Apply for IP Protection" }),
    ).toBeVisible();

    await page.goto("/application-document");
    await expect(
      page.getByRole("heading", { name: "Application Documents" }),
    ).toBeVisible();

    await page.goto("/application-registry");
    await expect(
      page.getByRole("heading", { name: "Applications Registry" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add New Application" }),
    ).toHaveCount(0);

    await page.getByRole("button", { name: "Filter" }).click();
    await page
      .getByPlaceholder("Search by title...")
      .fill("Solar Water Purifier");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByText('Title: "Solar Water Purifier"')).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Solar Water Purifier" }).first(),
    ).toBeVisible();
    await expect(page.getByText("IRIS Brand Identity")).toHaveCount(0);
  });

  test("validates UP mail signups and accepts external collaborator requests", async ({
    page,
  }) => {
    await page.goto("/signup");

    await page.locator("#first_name").fill("Public");
    await page.locator("#last_name").fill("Tester");
    await page.locator("#email").fill("public@gmail.com");
    await page.locator("select").selectOption("CAS");
    await page.locator('input[type="checkbox"]').nth(1).check();
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText("Email must be a UP mail address.")).toBeVisible();

    await page.reload();
    await page.locator('input[type="checkbox"]').nth(0).check();
    await page.locator("#first_name").fill("External");
    await page.locator("#last_name").fill("Collaborator");
    await page.locator("#email").fill("external.collab@example.com");
    await page.getByPlaceholder("ex. WVSU - Bio").fill("WVSU");
    await page.locator('input[type="checkbox"]').nth(1).check();
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText("Registration submitted!")).toBeVisible();
  });

  test("renders the sign-in page with Google auth entry point", async ({ page }) => {
    await page.goto("/signin");

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign in with Google" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
  });
});
