import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ROLE_CONFIG, VALID_ROLES, type Role } from "@/lib/roles";
import { E2E_AUTH_COOKIES, isE2ETestMode } from "@/lib/e2e-auth";

const PUBLIC_ROUTES = [
  "/signin",
  "/signup",
  "/welcome",
  "/",
  "/application-registry",
  "/application-document",
  "/application-guide",
  "/api",
];

function normalizeRoleCookie(roleValue: string | undefined) {
  if (!roleValue) {
    return undefined;
  }

  const normalized = roleValue
    .trim()
    .replace(/^['"]|['"]$/g, "");

  return VALID_ROLES.includes(normalized as Role)
    ? (normalized as Role)
    : undefined;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

 
  // Public pages should not pay auth/proxy cost.
  if (isStaticAsset(pathname) || isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });;;
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isE2ETestMode()) {
    const roleValue =
      request.cookies.get(E2E_AUTH_COOKIES.role)?.value ??
      request.cookies.get("user-role")?.value;
    const userId = request.cookies.get(E2E_AUTH_COOKIES.userId)?.value;

    const role = normalizeRoleCookie(roleValue);

    if (!role || !userId) {
      if (!isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      return response;
    }

    if (!request.cookies.get("user-role")?.value) {
      response.cookies.set("user-role", role, { path: "/" });
    }

    if (isPublicRoute) {
      return response;
    }

    const allowedPrefixes = ROLE_CONFIG[role].allowedPrefixes;
    const isRouteAllowed = allowedPrefixes.some((prefix) =>
      pathname.startsWith(prefix),
    );

    if (!isRouteAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = ROLE_CONFIG[role].home;
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.cookies.set("user-role", role, { path: "/" });
      return redirectResponse;
    }

    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Get authenticated user claims
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Redirect unauthenticated users from protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (user && !isPublicRoute) {
    const rawCookie = request.cookies.get('user-role')

    let userRole = rawCookie?.value as Role | undefined;

    // If no role cookie, fetch from DB
    if (!userRole) {
      const { data: userData, error } = await supabase
        .schema("private")
        .from('users')
        .select('role')
        .eq('id', user.sub)
        .single()
      userRole = userData?.role as Role | undefined
    }

    // If the user is trying to access a route outside their allowed prefixes
    const allowedPrefixes = ROLE_CONFIG[userRole!]?.allowedPrefixes || []
    const isRouteAllowed = allowedPrefixes.some(prefix => pathname.startsWith(prefix))
    
    if (!isRouteAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = ROLE_CONFIG[userRole!]?.home || "/";
      const redirectResponse = NextResponse.redirect(url);
      // carry over the role cookie to the redirect response
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }
  }

  return response;;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
;