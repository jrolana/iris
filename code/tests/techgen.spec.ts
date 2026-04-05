import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { setupAuthenticatedPage } from "./support/setup";

const uploadFixture = path.join(
  process.cwd(),
  "tests",
  "fixtures",
  "sample-upload.pdf",
);

async function waitForTechgenRegistryReady(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Your Applications" }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Fetching applications...")).toHaveCount(0, {
    timeout: 20_000,
  });
}

async function confirmAction(page: Page) {
  await expect(page.getByRole("button", { name: "Confirm" }).last()).toBeVisible();
  await page.getByRole("button", { name: "Confirm" }).last().click();
}

async function cancelAction(page: Page) {
  await expect(page.getByRole("button", { name: "Cancel" }).last()).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).last().click();
}

async function goToApplication(page: Page, applicationId: string) {
  await page.goto(`/techgen/view-application?applicationID=${applicationId}`);
}

test.describe("techgen workflows", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedPage(page, "techgen");
  });

  test("shows the techgen dashboard updates and summary cards", async ({
    page,
  }) => {
    await page.goto("/techgen");

    await expect(
      page.getByRole("heading", { name: "Recent Updates" }),
    ).toBeVisible();
    await expect(page.getByText("Solar Water Purifier")).toBeVisible();
    await expect(page.getByText("IRIS Brand Identity")).toBeVisible();
  });

  test("filters the registry and opens an application from the results", async ({
    page,
  }) => {
    test.setTimeout(60_000);

    await page.goto("/techgen/application-registry");
    await waitForTechgenRegistryReady(page);

    await page.getByRole("button", { name: "Filter" }).click();
    await expect(page.getByPlaceholder("Search by title...")).toBeVisible({
      timeout: 15_000,
    });
    await page.getByPlaceholder("Search by title...").fill("Solar");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByText('Title: "Solar"')).toBeVisible();
    await expect(page.getByText("Fetching applications...")).toHaveCount(0, {
      timeout: 20_000,
    });
    await expect(
      page.getByRole("cell", { name: "Solar Water Purifier" }).first(),
    ).toBeVisible();
    await expect(page.getByText("IRIS Brand Identity")).toHaveCount(0);

    await Promise.all([
      page.waitForURL(/applicationID=app-1/, { timeout: 15_000 }),
      page.getByRole("link", { name: "View Solar Water Purifier" }).click(),
    ]);
    await expect(
      page.getByRole("heading", { name: "Solar Water Purifier" }),
    ).toBeVisible();
  });

  test("shows application details, collaborator states, owned files, and version history", async ({
    page,
  }) => {
    await goToApplication(page, "app-1");

    await expect(
      page.getByRole("heading", { name: "Solar Water Purifier" }),
    ).toBeVisible();
    await expect(page.getByText("Latest note from TTBDO")).toBeVisible();
    await expect(page.getByText("TTBDO is reviewing the disclosure packet.")).toBeVisible();

    await expect(page.getByText("disclosure.pdf").first()).toBeVisible();
    await expect(page.getByText("market-summary.pdf")).toBeVisible();
    await expect(page.getByText("by jrolana")).toBeVisible();

    await page.getByRole("button", { name: /Show 1 previous versions/i }).click();
    await expect(page.getByText("disclosure.pdf")).toHaveCount(2);

    await page.getByRole("button", { name: "Tech Gens" }).click();
    await expect(
      page.getByRole("main").getByText("techgen iris", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("jrolana", { exact: true })).toBeVisible();
    await expect(page.getByText("Jhoanna O.", { exact: true })).toBeVisible();
    await expect(page.getByText("Verified Account").first()).toBeVisible();
    await expect(page.getByText("Unverified Account")).toBeVisible();
  });

  test("lets a techgen request a status update when an application is overdue", async ({
    page,
  }) => {
    await goToApplication(page, "app-1");

    await expect(
      page.getByRole("button", { name: "Request a status update" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Request a status update" }).click();

    await expect(
      page.getByText("Status update requested", { exact: false }),
    ).toBeVisible();
    await expect(page.getByText("Pending office response")).toBeVisible();
  });

  test("files a collaborator report only after confirmation", async ({
    page,
  }) => {
    await goToApplication(page, "app-1");
    await page.getByRole("button", { name: "Tech Gens" }).click();

    await page.getByRole("button", { name: "File Report" }).click();
    await expect(
      page.getByText("File a report against jrolana"),
    ).toBeVisible();

    await page
      .locator("textarea")
      .fill("The collaborator details need review because the listed contribution is inaccurate.");

    await page.getByRole("button", { name: "Report" }).click();
    await cancelAction(page);
    await expect(
      page.getByText("File a report against jrolana"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Report" }).click();
    await confirmAction(page);

    await expect(page.getByRole("button", { name: "Report Filed" })).toBeVisible();
  });

  test("auto-links an unverified collaborator after confirmation", async ({
    page,
  }) => {
    await goToApplication(page, "app-1");
    await page.getByRole("button", { name: "Tech Gens" }).click();

    const unverifiedInventor = page
      .locator("li")
      .filter({ has: page.getByText("Jhoanna O.", { exact: true }) });

    await expect(unverifiedInventor.getByText("Unverified Account")).toBeVisible();

    await unverifiedInventor.getByRole("button", { name: "Link Account" }).click();
    await cancelAction(page);
    await expect(unverifiedInventor.getByText("Unverified Account")).toBeVisible();

    await unverifiedInventor.getByRole("button", { name: "Link Account" }).click();
    await confirmAction(page);

    await expect(unverifiedInventor.getByText("Verified Account")).toBeVisible();
    await expect(page.getByText("Jhoanna Olana", { exact: true })).toBeVisible();
  });

  test("views an existing file and uploads a new attachment through the modal flow", async ({
    page,
  }) => {
    await goToApplication(page, "app-1");

    const disclosureItem = page
      .locator("li")
      .filter({ has: page.getByText("disclosure.pdf").first() })
      .first();
    const popupPromise = page.waitForEvent("popup");
    await disclosureItem.getByRole("button", { name: "View" }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    await popup.close();

    await page.getByRole("button", { name: "Upload a file" }).click();
    const uploadDialog = page.getByRole("dialog").first();
    await expect(uploadDialog.getByText("Upload files related to this application.")).toBeVisible();
    await uploadDialog.locator('input[type="file"]').setInputFiles(uploadFixture);
    await expect(uploadDialog.getByText("sample-upload.pdf")).toBeVisible();

    await page.getByRole("button", { name: "Upload 1 Item" }).click();
    await cancelAction(page);
    await expect(uploadDialog.getByText("sample-upload.pdf")).toBeVisible();

    await page.getByRole("button", { name: "Upload 1 Item" }).click();
    await confirmAction(page);

    await expect(page.getByText("sample-upload.pdf")).toBeVisible();
  });

  test("uploads a new file version instead of replacing the existing one", async ({
    page,
  }) => {
    await goToApplication(page, "app-1");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Update" }).first().click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(uploadFixture);

    await expect(page.getByText("Update File Version")).toBeVisible();
    await page.getByPlaceholder("e.g., Revised based on comments").fill(
      "Revised after office comments",
    );
    await page.getByRole("button", { name: "Upload New Version" }).click();
    await confirmAction(page);

    await expect(
      page.getByRole("button", { name: /Show 2 previous versions/i }),
    ).toBeVisible();
  });

  test("creates a new application after confirmation and keeps collaborators visible in the detail page", async ({
    page,
  }) => {
    await page.goto("/techgen/new-application");

    await page
      .getByRole("button", { name: "No, I already know what to choose" })
      .click();
    await page.getByRole("button", { name: "Patent" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Proceed to application" }).click();

    await expect(page).toHaveURL(/\/techgen\/start-application\?ipType=patent/);

    await page
      .getByPlaceholder(
        "e.g., A study on the effectiveness of IRIS in managing intellectual property",
      )
      .fill("AI-powered Reef Monitoring");
    await page
      .getByPlaceholder("e.g., Department of Science and Technology (DOST)")
      .fill("DOST");

    await page
      .getByRole("button", { name: "List technology generator collaborators" })
      .click();
    await page.getByText("Add Technology Generator").click();
    await page
      .getByPlaceholder("Search with their name or email...")
      .fill("jrolana");
    await page.getByRole("button", { name: "Add Verified" }).click();

    await expect(page.getByText("jrolana@up.edu.ph")).toBeVisible();

    await page.locator('input[type="file"]').first().setInputFiles(uploadFixture);
    await expect(page.getByText("sample-upload.pdf")).toBeVisible();

    await page.getByRole("button", { name: "Submit Application" }).click();
    await cancelAction(page);
    await expect(page).toHaveURL(/\/techgen\/start-application\?ipType=patent/);

    await page.getByRole("button", { name: "Submit Application" }).click();
    await confirmAction(page);

    await expect(page).toHaveURL(/\/techgen\/view-application\?applicationID=app-4/);
    await expect(page.getByText("AI-powered Reef Monitoring")).toBeVisible();
    await expect(page.getByText("Reminders")).toBeVisible();
    await expect(page.getByText("sample-upload.pdf")).toBeVisible();

    await page.getByRole("button", { name: "Tech Gens" }).click();
    await expect(page.getByText("jrolana", { exact: true }).last()).toBeVisible();
  });

  test("shows techgen notifications and lets the user clear unread reminders", async ({
    page,
  }) => {
    await page.goto("/techgen/notifications");

    await expect(
      page.getByRole("heading", { name: "Notifications" }),
    ).toBeVisible();
    await expect(page.getByText("Status updated")).toBeVisible();
    await expect(page.getByText("Deadline adjusted")).toBeVisible();

    await page.getByRole("button", { name: "Mark all as read" }).click();
    await expect(page.getByText("All caught up")).toBeVisible();
  });
});
