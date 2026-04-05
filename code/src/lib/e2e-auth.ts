import { VALID_ROLES } from "@/lib/roles";
import type { UserType } from "@/lib/types/users";

export const E2E_AUTH_COOKIES = {
  userId: "iris-e2e-user-id",
  email: "iris-e2e-email",
  fullName: "iris-e2e-full-name",
  role: "iris-e2e-role",
  collegeCode: "iris-e2e-college-code",
  externalInstitution: "iris-e2e-external-institution",
  otherCollegeName: "iris-e2e-other-college-name",
  imageUrl: "iris-e2e-image-url",
  isActive: "iris-e2e-is-active",
  createdAt: "iris-e2e-created-at",
} as const;

type CookieName = (typeof E2E_AUTH_COOKIES)[keyof typeof E2E_AUTH_COOKIES];

type E2EUser = UserType["Row"] & {
  image_url?: string;
};

function readCookieValue(
  allCookies: Record<string, string>,
  name: CookieName,
): string | undefined {
  const value = allCookies[name];
  return value === undefined || value === "" ? undefined : value;
}

function normalizeRoleValue(roleValue: string | undefined) {
  if (!roleValue) {
    return undefined;
  }

  const normalized = roleValue
    .trim()
    .replace(/^['"]|['"]$/g, "");

  return VALID_ROLES.find((validRole) => validRole === normalized);
}

function parseCookieHeader(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex < 0) {
        return acc;
      }

      const name = part.slice(0, separatorIndex);
      const value = part.slice(separatorIndex + 1);

      acc[name] = decodeURIComponent(value);
      return acc;
    }, {});
}

export function isE2ETestMode() {
  return (
    process.env.PLAYWRIGHT_TEST === "true" ||
    process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === "true"
  );
}

export function getE2EUserFromCookies(
  readCookie: (name: CookieName) => string | undefined,
): E2EUser | null {
  if (!isE2ETestMode()) {
    return null;
  }

  const roleValue = readCookie(E2E_AUTH_COOKIES.role);
  const userId = readCookie(E2E_AUTH_COOKIES.userId);
  const email = readCookie(E2E_AUTH_COOKIES.email);
  const fullName = readCookie(E2E_AUTH_COOKIES.fullName);

  const role = normalizeRoleValue(roleValue);

  if (!role) {
    return null;
  }

  if (!userId || !email || !fullName) {
    return null;
  }

  return {
    id: userId,
    email,
    full_name: fullName,
    role,
    college_code: readCookie(E2E_AUTH_COOKIES.collegeCode) ?? null,
    external_institution:
      readCookie(E2E_AUTH_COOKIES.externalInstitution) ?? null,
    other_college_name: readCookie(E2E_AUTH_COOKIES.otherCollegeName) ?? null,
    image_url: readCookie(E2E_AUTH_COOKIES.imageUrl),
    is_active: readCookie(E2E_AUTH_COOKIES.isActive) !== "false",
    created_at:
      readCookie(E2E_AUTH_COOKIES.createdAt) ?? new Date(0).toISOString(),
  };
}

export function getE2EUserFromDocument() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = parseCookieHeader(document.cookie);
  return getE2EUserFromCookies((name) => readCookieValue(cookies, name));
}

export function clearE2EAuthCookies() {
  if (typeof document === "undefined") {
    return;
  }

  Object.values(E2E_AUTH_COOKIES).forEach((name) => {
    document.cookie = `${name}=; path=/; max-age=0`;
  });
}

export function getE2EUserRoleFromDocument() {
  return getE2EUserFromDocument()?.role ?? null;
}

export function getE2EAuthUser() {
  const e2eUser = getE2EUserFromDocument();

  if (!e2eUser) {
    return null;
  }

  return {
    id: e2eUser.id,
    email: e2eUser.email,
    user_metadata: {
      avatar_url: e2eUser.image_url,
    },
  };
}

export function getE2EUserFromCookieHeader(cookieHeader: string) {
  const cookies = parseCookieHeader(cookieHeader);
  return getE2EUserFromCookies((name) => readCookieValue(cookies, name));
}
