import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ROLE_CONFIG, type Role } from "@/lib/roles";
import { getBaseUrl } from "@/lib/helper/get-base-url";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const baseUrl = getBaseUrl(origin);

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const redirectWithError = (msg: string) =>
    NextResponse.redirect(
      `${baseUrl}/signin?error=${encodeURIComponent(msg)}`,
    );

  // Handle provider errors
  if (error) {
    return redirectWithError(
      error === "access_denied"
        ? "Your account isn't registered yet. Please sign up first."
        : "There was an issue signing you in. Please try again.",
    );
  }

  const cookieStore = await cookies();
  const requestCookies = cookieStore.getAll();
  const hasPkceVerifier = requestCookies.some(({ name }) =>
    name.endsWith("-code-verifier"),
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookieList) => {
          cookieList.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  // Handle invite token
  if (token_hash && type === "invite") {
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      type: "invite",
      token_hash,
    });

    if (verifyError || !data.session) {
      return NextResponse.redirect(
        `${baseUrl}/welcome?error=${encodeURIComponent(
          "Your invite link is invalid or has expired. Please request a new one.",
        )}`,
      );
    }

    return NextResponse.redirect(`${baseUrl}/welcome`);
  }

  // Handle OAuth code
  if (!code) {
    return redirectWithError(
      "No authentication code found. Please try signing in again.",
    );
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (sessionError || !session?.user) {
    console.error("Supabase auth code exchange failed", {
      error: sessionError
        ? {
            name: sessionError.name,
            message: sessionError.message,
            status: "status" in sessionError ? sessionError.status : undefined,
            code: "code" in sessionError ? sessionError.code : undefined,
          }
        : null,
      hasPkceVerifier,
      cookieNames: requestCookies.map(({ name }) => name),
      requestOrigin: origin,
      baseUrl,
    });

    if (!hasPkceVerifier) {
      return redirectWithError(
        "Authentication failed because the sign-in verifier cookie was missing. Try again in the same browser, and make sure the app stays on the same exact host and port.",
      );
    }

    return redirectWithError(
      sessionError?.message || "Authentication failed. Please try signing in again.",
    );
  }

  // Fetch user role
  console.info("Supabase auth code exchange succeeded", {
    userId: session.user.id,
    email: session.user.email,
    requestOrigin: origin,
    baseUrl,
    cookieNames: cookieStore.getAll().map(({ name }) => name),
  });

  const { data: userRole, error: userError } = await supabase.rpc("get_user_role");
  if (userError || !userRole) {
    console.error("Supabase user role lookup failed after sign-in", {
      userId: session.user.id,
      email: session.user.email,
      error: userError
        ? {
            message: userError.message,
            code: userError.code,
            details: userError.details,
            hint: userError.hint,
          }
        : null,
      userRole,
    });

    return redirectWithError(
      "Unable to determine your account role. Please contact ttbdo.upvisayas@up.edu.ph.",
    );
  }

  const role = userRole as Role;
  const home = ROLE_CONFIG[role]?.home ?? "/";

  console.info("Supabase sign-in redirect resolved", {
    userId: session.user.id,
    email: session.user.email,
    role,
    home,
  });

  return NextResponse.redirect(`${baseUrl}${home}`);
}
