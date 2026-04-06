import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { setupAuthenticatedPage } from "./support/setup";

const uploadFixture = path.join(
  process.cwd(),
  "tests",
  "fixtures",
  "sample-upload.pdf",
);

const textUploadFixture = path.join(
  process.cwd(),
  "tests",
  "fixtures",
  "sample-upload.txt",
);

async function waitForRegistryReady(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Applications Registry" }),
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
  await page.goto(`/admin/view-application?applicationID=${applicationId}`, {
    waitUntil: "domcontentloaded",
  });
}

async function installBrowserCapture(page: Page) {
  await page.addInitScript(() => {
    (window as typeof window & {
      __openCalls?: string[][];
      __downloadClicks?: Array<{ href: string; download: string }>;
      __locationAssignments?: string[];
      __copiedText?: string;
    }).__openCalls = [];
    (window as typeof window & {
      __openCalls?: string[][];
      __downloadClicks?: Array<{ href: string; download: string }>;
      __locationAssignments?: string[];
      __copiedText?: string;
    }).__downloadClicks = [];
    (window as typeof window & {
      __openCalls?: string[][];
      __downloadClicks?: Array<{ href: string; download: string }>;
      __locationAssignments?: string[];
      __copiedText?: string;
    }).__locationAssignments = [];

    window.open = ((...args: (string | URL | undefined)[]) => {
      const targetWindow = window as typeof window & {
        __openCalls?: string[][];
      };
      targetWindow.__openCalls?.push(args.map((arg) => String(arg ?? "")));
      return null;
    }) as typeof window.open;

    HTMLAnchorElement.prototype.click = function () {
      const targetWindow = window as typeof window & {
        __downloadClicks?: Array<{ href: string; download: string }>;
      };
      targetWindow.__downloadClicks?.push({
        href: this.href,
        download: this.download,
      });
    };

    Location.prototype.assign = function (url: string | URL) {
      const targetWindow = window as typeof window & {
        __locationAssignments?: string[];
      };
      targetWindow.__locationAssignments?.push(String(url));
    };
  });
}

async function readBrowserCapture(page: Page) {
  return page.evaluate(() => {
    const targetWindow = window as typeof window & {
      __openCalls?: string[][];
      __downloadClicks?: Array<{ href: string; download: string }>;
      __locationAssignments?: string[];
      __copiedText?: string;
    };

    return {
      openCalls: targetWindow.__openCalls ?? [],
      downloadClicks: targetWindow.__downloadClicks ?? [],
      locationAssignments: targetWindow.__locationAssignments ?? [],
      copiedText: targetWindow.__copiedText ?? "",
    };
  });
}

async function selectYearRange(page: Page, from: string, to: string) {
  const selects = page.locator("select");
  await selects.nth(0).selectOption(from);
  await selects.nth(1).selectOption(to);
}

test.describe("admin workflows", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedPage(page, "admin");
  });

  test("manages dashboard exports, year filters, and status update requests", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await page.goto("/admin", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: "IP Portfolio Overview" }),
    ).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "Export" }).click();
    const csvDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export CSV" }).click();
    const csvDownload = await csvDownloadPromise;
    expect(csvDownload.suggestedFilename()).toContain("ip-portfolio-2026-2026.csv");
    await expect(page.getByText("CSV exported successfully.")).toBeVisible();

    await page.getByRole("button", { name: "Export" }).click();
    const pdfDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export PDF" }).click();
    const pdfDownload = await pdfDownloadPromise;
    expect(pdfDownload.suggestedFilename()).toContain("ip-portfolio-2026-2026.pdf");
    await expect(page.getByText("PDF exported successfully.")).toBeVisible();

    await page.getByRole("button", { name: "Last 3 Years" }).click();
    await expect(page.getByText("Range: 2024–2026")).toBeVisible();

    await page.getByRole("button", { name: "Custom Range" }).click();
    await selectYearRange(page, "2025", "2026");
    await expect(page.getByText("Range: 2025–2026")).toBeVisible();
    await expect(page.getByText("Preset: Custom Range")).toBeVisible();

    await page.getByLabel("Open requests").click();
    await expect(
      page.getByRole("heading", { name: "Status Update Requests" }),
    ).toBeVisible();
    await expect(page.getByText("Campus Analytics Toolkit")).toBeVisible();

    await page
      .locator("li")
      .filter({ has: page.getByText("Campus Analytics Toolkit") })
      .getByRole("button", { name: "Acknowledge" })
      .click();

    await expect(page.getByText("Request acknowledged")).toBeVisible();
    await expect(
      page
        .locator("li")
        .filter({ has: page.getByText("Campus Analytics Toolkit") })
        .getByRole("button", { name: "Acknowledge" }),
    ).toHaveCount(0);

    await page.getByRole("button", { name: "View All Requests" }).click();
    await expect(page).toHaveURL(/\/admin\/pings$/);
    await expect(
      page.getByRole("heading", { name: "Status Update Requests" }),
    ).toBeVisible();
    await expect(page.getByText("Campus Analytics Toolkit")).toBeVisible();
  });

  test("handles attachment actions and links tech generator accounts", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await installBrowserCapture(page);
    await goToApplication(page, "app-1");

    await expect(
      page.getByRole("heading", { name: "Solar Water Purifier" }),
    ).toBeVisible();

    const disclosureItem = page
      .locator("li")
      .filter({ has: page.getByText("disclosure.pdf").first() })
      .first();

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

    const refreshedDisclosureItem = page
      .locator("li")
      .filter({ has: page.getByText("disclosure.pdf").first() })
      .first();

    await refreshedDisclosureItem.locator('input[type="file"]').setInputFiles(uploadFixture);
    await expect(page.getByText("Update File Version")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText("Update File Version")).toHaveCount(0);

    await page.getByRole("button", { name: "Tech Gens" }).click();
    const unverifiedInventor = page
      .locator("li")
      .filter({ has: page.getByText("Jhoanna O.", { exact: true }) });

    await expect(unverifiedInventor.getByRole("button", { name: "Link Account" })).toBeVisible();
    await unverifiedInventor.getByRole("button", { name: "Link Account" }).click();
    await expect(
      page.getByRole("heading", { name: "Link Existing Technology Generator" }),
    ).toBeVisible();
    await page
      .getByPlaceholder("Search a technology generator with their name or email...")
      .fill("jhoannaolana91@gmail.com");

    const linkOption = page
      .locator("li")
      .filter({ has: page.getByText("jhoannaolana91@gmail.com") });
    await linkOption.getByRole("button", { name: "Link Account" }).click();
    await cancelAction(page);
    await expect(unverifiedInventor.getByRole("button", { name: "Link Account" })).toBeVisible();

    await unverifiedInventor.getByRole("button", { name: "Link Account" }).click();
    await page
      .getByPlaceholder("Search a technology generator with their name or email...")
      .fill("jhoannaolana91@gmail.com");
    await linkOption.getByRole("button", { name: "Link Account" }).click();
    await confirmAction(page);

    await expect(unverifiedInventor.getByText("Verified Account")).toBeVisible();
    await expect(page.getByText("Jhoanna Olana", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Attachments" }).click();
    await disclosureItem.getByRole("button", { name: "View" }).click();
    await disclosureItem.getByRole("button", { name: "Download" }).click();

    const capture = await readBrowserCapture(page);
    expect(capture.openCalls.length).toBeGreaterThan(0);
  });

  test("edits application details, updates status, and withdraws applications", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await goToApplication(page, "app-1");

    await page.getByRole("button", { name: "Edit details" }).click();
    await expect(
      page.getByRole("heading", { name: "Edit application details" }),
    ).toBeVisible();

    const editDialog = page.getByRole("dialog").first();
    await editDialog
      .locator("textarea")
      .first()
      .fill("Solar Water Purifier - Cancelled Edit");
    await editDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText("Solar Water Purifier - Cancelled Edit")).toHaveCount(
      0,
    );

    await page.getByRole("button", { name: "Edit details" }).click();
    await editDialog
      .locator("textarea")
      .first()
      .fill("Solar Water Purifier - Updated by Admin");
    await editDialog.getByPlaceholder("Enter IP number").fill("PAT-2026-001");
    await editDialog.getByRole("button", { name: "Save changes" }).click();
    await confirmAction(page);
    await expect(
      page.getByText("Application details updated successfully."),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Solar Water Purifier - Updated by Admin",
      }),
    ).toBeVisible();
    await expect(page.getByText("IP Number: PAT-2026-001")).toBeVisible();

    await page.getByRole("button", { name: "Update status" }).click();
    await expect(page.getByText("Update status and notify record")).toBeVisible();
    await page
      .getByPlaceholder(
        "Briefly describe what changed, what TTBDO did, and what the tech gens should expect next.",
      )
      .fill("This note should not be saved.");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText("This note should not be saved.")).toHaveCount(0);

    await page.getByRole("button", { name: "Update status" }).click();
    const statusDialog = page.getByRole("dialog").first();
    await statusDialog.locator("button").nth(1).click();
    await statusDialog.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Prior Art Search" }).click();
    await statusDialog.getByPlaceholder(
      "Briefly describe what changed, what TTBDO did, and what the tech gens should expect next.",
    ).fill("Prior art review started by TTBDO.");
    await statusDialog.getByRole("button", { name: "Save" }).click();
    await confirmAction(page);

    await expect(page.getByText("Prior art review started by TTBDO.")).toBeVisible();
    await expect(
      page.locator("header").getByText("Prior Art Search", { exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Withdraw" }).click();
    await cancelAction(page);
    await expect(page.getByRole("button", { name: "Withdraw" })).toBeVisible();

    await page.getByRole("button", { name: "Withdraw" }).click();
    await confirmAction(page);
    await expect(page.getByRole("button", { name: "Revert Withdrawal" })).toBeVisible();
  });

  test("views collaborator reports and removes a tech generator", async ({
    page,
  }) => {
    await goToApplication(page, "app-3");

    await expect(
      page.getByRole("heading", { name: "Campus Analytics Toolkit" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Tech Gens" }).click();
    await page
      .locator("li")
      .filter({ has: page.getByText("Jhoanna Olana", { exact: true }) })
      .getByRole("button", { name: /Reports/ })
      .click();

    await expect(
      page.getByRole("heading", { name: "Reports for Jhoanna Olana" }),
    ).toBeVisible();
    await expect(
      page.getByText("Please review the collaborator assignment before the registration record is finalized."),
    ).toBeVisible();

    await page.getByRole("button", { name: "Remove Tech Gen" }).click();
    await confirmAction(page);

    await expect(page.getByText("Jhoanna Olana has been removed from the application.")).toBeVisible();
    await expect(page.getByText("No tech gens recorded yet.")).toBeVisible();
  });

  test("invites a new user from user management", async ({ page }) => {
    await page.goto("/admin/user-management", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: "Users" }).first(),
    ).toBeVisible();

    await page.getByRole("button", { name: "Add New User" }).click();
    await expect(
      page.getByRole("heading", { name: "Invite a new user" }),
    ).toBeVisible();

    await page.getByPlaceholder("username@up.edu.ph").fill("fresh.admin@up.edu.ph");
    await page.locator("select").last().selectOption("admin");
    await page.getByRole("button", { name: "Save Changes" }).click();
    await confirmAction(page);

    await expect(
      page.getByText("The user has been invited and will receive an email shortly."),
    ).toBeVisible();
  });

  test("approves user registration requests", async ({ page }) => {
    await page.goto("/admin/user-management", { waitUntil: "domcontentloaded" });

    const requestRow = page
      .locator("tr")
      .filter({ has: page.getByText("new.techgen@up.edu.ph") });

    await requestRow.getByRole("button", { name: "Approve" }).click();
    await confirmAction(page);

    await expect(
      page.getByText("Successfully approved the registration request."),
    ).toBeVisible();
    await expect(requestRow.getByText("approved")).toBeVisible();
  });

  test("rejects user registration requests", async ({ page }) => {
    await page.goto("/admin/user-management", { waitUntil: "domcontentloaded" });

    const requestRow = page
      .locator("tr")
      .filter({ has: page.getByText("new.techgen@up.edu.ph") });

    await requestRow.getByRole("button", { name: "Reject" }).click();
    await confirmAction(page);

    await expect(
      page.getByText("Successfully rejected the registration request."),
    ).toBeVisible();
    await expect(requestRow.getByText("rejected")).toBeVisible();
  });

  test("generates and copies an API token", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            (
              window as typeof window & {
                __copiedText?: string;
              }
            ).__copiedText = text;
          },
        },
      });
    });

    await page.goto("/admin/developer-settings", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByRole("heading", { name: "Developer Settings" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Generate" }).click();
    const tokenInput = page.getByPlaceholder("API Token");
    await expect(tokenInput).not.toHaveValue("");

    const generatedToken = await tokenInput.inputValue();
    expect(generatedToken).toMatch(/^iris-e2e-token-/);

    await page.locator('input[placeholder="API Token"] + button').click();
    await expect(page.getByText("API token copied to clipboard!")).toBeVisible();

    const capture = await readBrowserCapture(page);
    expect(capture.copiedText).toBe(generatedToken);
  });

  test("creates a new application from the registry through the guided wizard", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await installBrowserCapture(page);
    await page.goto("/admin/application-registry", {
      waitUntil: "domcontentloaded",
    });
    await waitForRegistryReady(page);

    await page.getByRole("button", { name: "Add New Application" }).click();
    await expect(page).toHaveURL(/\/admin\/new-application$/);

    await page.getByRole("button", { name: "Use guided classification" }).click();
    await page.getByRole("button", { name: "Technology" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Device" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page
      .getByRole("button", { name: "The technical function or mechanism" })
      .click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page
      .getByRole("button", {
        name: "Substantially new / inventive technical solution",
      })
      .click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Use this recommendation" }).click();

    const documentItem = page
      .locator("li")
      .filter({ has: page.getByText("patent-disclosure-form.pdf") });
    await expect(documentItem).toBeVisible();
    await documentItem.getByRole("button", { name: "View" }).click();
    await documentItem.getByRole("button", { name: "Download" }).click();

    const capture = await readBrowserCapture(page);
    expect(capture.openCalls[0]?.[0]).toContain("patent-disclosure-form.pdf");
    expect(capture.downloadClicks[0]?.download).toBe("patent-disclosure-form.pdf");

    await page
      .getByRole("button", { name: "Proceed to application record" })
      .click();
    await expect(page).toHaveURL(/\/admin\/start-application\?ipType=patent/);

    await page
      .getByPlaceholder(
        "e.g., A study on the effectiveness of IRIS in managing intellectual property",
      )
      .fill("AI-assisted Water Quality Monitor");
    await page
      .getByPlaceholder("e.g., Department of Science and Technology (DOST)")
      .fill("DOST");

    await page
      .getByRole("button", { name: "List technology generator collaborators" })
      .click();
    await page
      .getByPlaceholder("Search with their name or email...")
      .fill("jrolana");
    await page.getByRole("button", { name: "Add Verified" }).click();
    await expect(page.getByText("jrolana@up.edu.ph")).toBeVisible();

    await page.locator('input[type="file"]').first().setInputFiles(uploadFixture);
    await expect(page.getByText("sample-upload.pdf")).toBeVisible();

    await page.getByRole("button", { name: "Submit Application" }).click();
    await confirmAction(page);

    await expect(page).toHaveURL(/\/admin\/view-application\?applicationID=app-4/);
    await expect(page.getByText("AI-assisted Water Quality Monitor")).toBeVisible();
    await expect(page.getByText("sample-upload.pdf")).toBeVisible();
    await page.getByRole("button", { name: "Tech Gens" }).click();
    await expect(page.getByText("jrolana", { exact: true }).last()).toBeVisible();
  });

  test("validates required start-application inputs and supports manual collaborators", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await page.goto("/admin/start-application?ipType=patent", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByRole("heading", { name: "Fill-up application details" }),
    ).toBeVisible();

    const submitButton = page.getByRole("button", { name: "Submit Application" });
    await expect(submitButton).toBeDisabled();

    await page
      .getByPlaceholder(
        "e.g., A study on the effectiveness of IRIS in managing intellectual property",
      )
      .fill("Manual Collaborator Patent Record");
    await expect(submitButton).toBeDisabled();

    await page
      .getByRole("button", { name: "List technology generator collaborators" })
      .click();
    await page.getByRole("button", { name: "Add Manually" }).click();
    await page.getByPlaceholder("ex. Juan Dela Cruz").fill("Manual Collaborator");
    await page.getByPlaceholder("user@up.edu.ph").fill("manual.collab@up.edu.ph");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "CAS", exact: true }).click();
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Manual Collaborator")).toBeVisible();
    await expect(submitButton).toBeDisabled();

    await page.locator('input[type="file"]').first().setInputFiles(textUploadFixture);
    await expect(page.getByText("sample-upload.txt")).toHaveCount(0);
    await expect(submitButton).toBeDisabled();

    await page.locator('input[type="file"]').first().setInputFiles(uploadFixture);
    await expect(page.getByText("sample-upload.pdf")).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});
