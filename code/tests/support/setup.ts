import type { Page } from "@playwright/test";
import { signInAs } from "./auth";
import { installSupabaseMocks } from "./supabase-mocks";
import type { TestRole } from "./mock-data";

export async function setupAuthenticatedPage(page: Page, role: TestRole) {
  const state = await installSupabaseMocks(page, role);
  await signInAs(page, role);
  return state;
}

export async function setupGuestPage(page: Page, role: TestRole = "techgen") {
  return installSupabaseMocks(page, role);
}
