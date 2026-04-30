import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ROLE_CONFIG, type Role } from "@/lib/roles";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const redirectWithError = (msg: string) =>
    NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(msg)}`,
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
        `${origin}/welcome?error=${encodeURIComponent(
          "Your invite link is invalid or has expired. Please request a new one.",
        )}`,
      );
    }

    return NextResponse.redirect(`${origin}/welcome`);
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
    return redirectWithError(
      "Authentication failed. Please try signing in again.",
    );
  }

  // Fetch user role
  const { data: userRole, error: userError } = await supabase.rpc('get_user_role')
  if (userError || !userRole) return redirectWithError('Unable to determine your account role. Please contact ttbdo.upvisayas@up.edu.ph.')

  const role = userRole as Role;
  const home = ROLE_CONFIG[role]?.home ?? "/";

  return NextResponse.redirect(`${origin}${home}`);
}