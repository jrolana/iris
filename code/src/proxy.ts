import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ROLE_CONFIG, type Role } from "@/lib/roles";

const PUBLIC_ROUTES = [
  "/",
  "/api/users",
  "/signin",
  "/signup",
  "/welcome",
  "/application-registry",
  "/application-document",
  "/application-guide",
  "/wizard",
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAuthRoute(pathname: string) {
  return pathname === "/signin" || pathname === "/signup";
}

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf|otf)$/.test(
      pathname,
    )
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestCookieNames = request.cookies.getAll().map(({ name }) => name);

 
  // Public pages should not pay auth/proxy cost.
  if (isStaticAsset(pathname) || isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error: claimsError } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    console.warn("Proxy rejected request because no auth claims were found", {
      pathname,
      requestOrigin: request.nextUrl.origin,
      requestCookieNames,
      claimsError: claimsError
        ? {
            name: claimsError.name,
            message: claimsError.message,
            status:
              "status" in claimsError ? claimsError.status : undefined,
            code: "code" in claimsError ? claimsError.code : undefined,
          }
        : null,
    });

    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const { data: userRoleData, error: userRoleError } =
    await supabase.rpc("get_user_role");

  const userRole = userRoleData as Role | undefined;

  response.cookies.set("user-role", "", {
    path: "/",
    maxAge: 0,
  });

  if (!userRole || !ROLE_CONFIG[userRole]) {
    console.warn("Proxy rejected request because no valid role was found", {
      pathname,
      userId: claims.sub,
      requestOrigin: request.nextUrl.origin,
      requestCookieNames,
      userRoleError: userRoleError
        ? {
            message: userRoleError.message,
            code: userRoleError.code,
            details: userRoleError.details,
            hint: userRoleError.hint,
          }
        : null,
      userRoleData,
    });

    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const allowedPrefixes = ROLE_CONFIG[userRole].allowedPrefixes;
  const isRouteAllowed = allowedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isRouteAllowed) {
    const url = request.nextUrl.clone();
    url.pathname = ROLE_CONFIG[userRole].home;

    const redirectResponse = NextResponse.redirect(url);

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });

    return redirectResponse;
  }

  if (isAuthRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = ROLE_CONFIG[userRole].home;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf|otf)$).*)",
  ],
};
