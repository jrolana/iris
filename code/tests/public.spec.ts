import { expect, test, type Page } from "@playwright/test";
import {
  clickIpTitleSortOption,
  expectTitlesSortedByCurrentIpTitleLabel,
} from "./support/application-registry";
import { setupGuestPage } from "./support/setup";

async function waitForPublicRegistryReady(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Applications Registry" }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Fetching applications...")).toHaveCount(0, {
    timeout: 20_000,
  });
}

async function goToSignup(page: Page) {
  await page.goto("/signup", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();
  await expect(page.getByText("Compiling")).toHaveCount(0, { timeout: 30_000 });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      }),
  );
  const firstNameField = page.locator("#first_name");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const probeValue = `signup-ready-${attempt}`;
    await firstNameField.fill(probeValue);
    await page.waitForTimeout(150);
    if ((await firstNameField.inputValue()) === probeValue) {
      await firstNameField.fill("");
      break;
    }
  }
}

function externalCollaboratorCheckbox(page: Page) {
  return page.getByRole("checkbox").first();
}

function termsCheckbox(page: Page) {
  return page.getByRole("checkbox").nth(1);
}

test.describe("guest workflows", () => {
  test.beforeEach(async ({ page }) => {
    await setupGuestPage(page);
  });

  test("shows only public applications in the registry", async ({ page }) => {
    await page.goto("/application-registry", { waitUntil: "domcontentloaded" });
    await waitForPublicRegistryReady(page);

    await expect(
      page.getByRole("button", { name: "Add New Application" }),
    ).toHaveCount(0);
    await expect(page.locator("thead")).not.toContainText("Status");
    await expect(page.locator("thead")).not.toContainText("Actions");

    await expect(
      page.getByRole("cell", { name: "IRIS Brandmark" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Campus Analytics Toolkit" }).first(),
    ).toBeVisible();
    await expect(page.getByText("Solar Water Purifier")).toHaveCount(0);
  });

  test("filters and sorts the public registry without exposing private applications", async ({
    page,
  }) => {
    await page.goto("/application-registry", { waitUntil: "domcontentloaded" });
    await waitForPublicRegistryReady(page);

    await page.getByRole("button", { name: "Filter" }).click();
    await page.getByPlaceholder("Search by title...").fill("Solar");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByText('Title: "Solar"')).toBeVisible();
    await expect(page.getByText("No applications found.")).toBeVisible();

    await page.goto("/application-registry", { waitUntil: "domcontentloaded" });
    await waitForPublicRegistryReady(page);

    await page.getByRole("button", { name: "Filter" }).click();
    await page.getByPlaceholder("Search by title...").fill("IRIS");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByText('Title: "IRIS"')).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "IRIS Brandmark" }).first(),
    ).toBeVisible();
    await expect(page.getByText("Solar Water Purifier")).toHaveCount(0);

    await page.goto("/application-registry", { waitUntil: "domcontentloaded" });
    await waitForPublicRegistryReady(page);

    await clickIpTitleSortOption(page);
    await expectTitlesSortedByCurrentIpTitleLabel(
      page,
      ["Campus Analytics Toolkit", "IRIS Brandmark"],
      ["IRIS Brandmark", "Campus Analytics Toolkit"],
    );
    await expect(page.getByText("Solar Water Purifier")).toHaveCount(0);
  });

  test("lets guests request registration and validates UP mail signups", async ({
    page,
  }) => {
    await goToSignup(page);

    await page.locator("#first_name").fill("Public");
    await expect(page.locator("#first_name")).toHaveValue("Public");
    await page.locator("#last_name").fill("Tester");
    await expect(page.locator("#last_name")).toHaveValue("Tester");
    await page.locator("#email").fill("public@gmail.com");
    await expect(page.locator("#email")).toHaveValue("public@gmail.com");
    await page.locator("select").selectOption("CAS");
    await expect(page.locator("select")).toHaveValue("CAS");
    await termsCheckbox(page).check();
    await expect(termsCheckbox(page)).toBeChecked();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeEnabled();
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(
      page.getByText("Email must be a UP mail address."),
    ).toBeVisible();

    await goToSignup(page);
    await externalCollaboratorCheckbox(page).check();
    await expect(externalCollaboratorCheckbox(page)).toBeChecked();
    await expect(
      page.getByPlaceholder("ex. WVSU - Bio"),
    ).toBeVisible();
    await page.locator("#first_name").fill("External");
    await expect(page.locator("#first_name")).toHaveValue("External");
    await page.locator("#last_name").fill("Collaborator");
    await expect(page.locator("#last_name")).toHaveValue("Collaborator");
    await page.locator("#email").fill("external.collab@example.com");
    await expect(page.locator("#email")).toHaveValue("external.collab@example.com");
    await page.getByPlaceholder("ex. WVSU - Bio").fill("WVSU");
    await expect(page.getByPlaceholder("ex. WVSU - Bio")).toHaveValue("WVSU");
    await termsCheckbox(page).check();
    await expect(termsCheckbox(page)).toBeChecked();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeEnabled();
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText("Registration submitted!")).toBeVisible();
  });
});
