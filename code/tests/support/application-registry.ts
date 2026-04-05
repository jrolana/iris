import { expect, type Page } from "@playwright/test";

export async function getRegistryTitles(page: Page) {
  return (await page.locator("tbody tr td:first-child a").allInnerTexts()).map(
    (text) => text.trim(),
  );
}

export async function clickIpTitleSortOption(page: Page) {
  await page.getByRole("button", { name: "Updated Date" }).click();
  await page
    .getByRole("button", { name: /IP Title \((A-Z|Z-A)\)/ })
    .click();
}

export async function expectTitlesSortedByCurrentIpTitleLabel(
  page: Page,
  ascendingTitles: string[],
  descendingTitles: string[],
) {
  const ipTitleSortButton = page
    .getByRole("button", {
      name: /IP Title \((A-Z|Z-A)\)/,
    })
    .first();
  const currentLabel = (await ipTitleSortButton.textContent())?.trim() ?? "";

  if (currentLabel.includes("A-Z")) {
    await expect.poll(() => getRegistryTitles(page)).toEqual(ascendingTitles);
    return;
  }

  await expect.poll(() => getRegistryTitles(page)).toEqual(descendingTitles);
}
