function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getBaseUrl(fallback?: string) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${trimTrailingSlash(process.env.VERCEL_PROJECT_PRODUCTION_URL)}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${trimTrailingSlash(process.env.VERCEL_URL)}`;
  }

  if (fallback) {
    return trimTrailingSlash(fallback);
  }

  return "http://localhost:3000";
}
