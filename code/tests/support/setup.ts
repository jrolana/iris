import type { Page } from "@playwright/test";
import { signInAs } from "./auth";
import { installSupabaseMocks } from "./supabase-mocks";
import type { TestRole, ViewerRole } from "./mock-data";

export async function setupAuthenticatedPage(page: Page, role: TestRole) {
  const state = await installSupabaseMocks(page, role);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await signInAs(page, role);
  return state;
}

export async function setupGuestPage(page: Page, role: ViewerRole = "guest") {
  return installSupabaseMocks(page, role);
}
