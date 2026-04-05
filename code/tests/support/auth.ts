import type { BrowserContext, Page } from "@playwright/test";
import { ROLE_USERS, type TestRole } from "./mock-data";

const BASE_URL = "http://127.0.0.1:3000";

export async function setRoleCookies(
  context: BrowserContext,
  role: TestRole,
) {
  const user = ROLE_USERS[role];

  const cookies = [
    { name: "iris-e2e-user-id", value: user.id },
    { name: "iris-e2e-email", value: user.email },
    { name: "iris-e2e-full-name", value: user.full_name },
    { name: "iris-e2e-role", value: user.role },
    { name: "user-role", value: user.role },
    { name: "iris-e2e-is-active", value: String(user.is_active) },
    { name: "iris-e2e-created-at", value: user.created_at },
  ];

  if (user.college_code) {
    cookies.push({ name: "iris-e2e-college-code", value: user.college_code });
  }

  if (user.external_institution) {
    cookies.push({
      name: "iris-e2e-external-institution",
      value: user.external_institution,
    });
  }

  if (user.other_college_name) {
    cookies.push({
      name: "iris-e2e-other-college-name",
      value: user.other_college_name,
    });
  }

  if (user.image_url) {
    cookies.push({ name: "iris-e2e-image-url", value: user.image_url });
  }

  await context.addCookies(
    cookies.map((cookie) => ({
      ...cookie,
      url: BASE_URL,
    })),
  );
}

export async function signInAs(page: Page, role: TestRole) {
  await setRoleCookies(page.context(), role);
}
