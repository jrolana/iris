import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ROLE_CONFIG, type Role } from "@/lib/roles";
import { supabaseAdmin } from "../../../../../../utils/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/constants/admin";

type SigninAdmission = {
  full_name: string;
  email: string;
  role: Role;
  college_code: string | null;
  other_college_name: string | null;
  external_institution: string | null;
};

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

  const userEmail = session.user.email?.toLowerCase();

  if (!userEmail) {
    await supabase.auth.signOut();
    return redirectWithError(
      "We couldn't read your Google account email. Please try a different account.",
    );
  }

  const { data: existingUserById, error: existingUserByIdError } =
    await supabaseAdmin
      .schema("private")
      .from("users")
      .select(
        "full_name, email, role, college_code, other_college_name, external_institution",
      )
      .eq("id", session.user.id)
      .maybeSingle();

  if (existingUserByIdError) {
    await supabase.auth.signOut();
    return redirectWithError(
      "We couldn't load your account. Please try again.",
    );
  }

  const { data: existingUserByEmail, error: existingUserByEmailError } =
    existingUserById
      ? { data: null, error: null }
      : await supabaseAdmin
          .schema("private")
          .from("users")
          .select(
            "full_name, email, role, college_code, other_college_name, external_institution",
          )
          .eq("email", userEmail)
          .maybeSingle();

  if (existingUserByEmailError) {
    await supabase.auth.signOut();
    return redirectWithError(
      "We couldn't load your account. Please try again.",
    );
  }

  let admission: SigninAdmission | null =
    (existingUserById as SigninAdmission | null) ??
    (existingUserByEmail as SigninAdmission | null) ??
    null;

  if (!admission) {
    const { data, error } = await supabase.rpc("assert_signin_allowed", {
      p_email: userEmail,
    });

    if (error) {
      await supabase.auth.signOut();

      const errorMessageByCode: Record<string, string> = {
        P0100: "We couldn't read your Google account email. Please try a different account.",
        P0101: "Your registration request is still pending approval.",
        P0102: `Your registration request was rejected. Please contact ${ADMIN_EMAIL}.`,
        P0103: "Your account isn't registered yet. Please sign up first.",
      };

      return redirectWithError(
        errorMessageByCode[error.code] ??
          "We couldn't verify your registration status. Please try again.",
      );
    }

    admission = (data?.[0] as SigninAdmission | undefined) ?? null;
  }

  if (!admission) {
    await supabase.auth.signOut();
    return redirectWithError(
      "We couldn't verify your registration status. Please try again.",
    );
  }

  const { data: existingUser, error: existingUserError } = await supabaseAdmin
    .schema("private")
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (existingUserError) {
    await supabase.auth.signOut();
    return redirectWithError(
      "We couldn't load your account. Please try again.",
    );
  }

  if (!existingUser) {
    const fullName =
      session.user.user_metadata?.name ||
      session.user.user_metadata?.full_name ||
      admission.full_name ||
      userEmail.split("@")[0];
    const imageUrl =
      session.user.user_metadata?.avatar_url ||
      session.user.user_metadata?.picture ||
      session.user.user_metadata?.image_url ||
      null;

    const { error: upsertUserError } = await supabaseAdmin
      .schema("private")
      .from("users")
      .upsert(
        {
          id: session.user.id,
          full_name: fullName,
          email: userEmail,
          role: admission.role,
          college_code: admission.college_code,
          other_college_name: admission.other_college_name,
          external_institution: admission.external_institution,
          image_url: imageUrl,
        },
        { onConflict: "id" },
      );

    if (upsertUserError) {
      await supabase.auth.signOut();
      return redirectWithError(
        `We couldn't finish setting up your account. Please contact ${ADMIN_EMAIL}.`,
      );
    }
  }

  // Fetch user role
  const { data: userRole, error: userError } = await supabase.rpc(
    "get_user_role",
  );
  if (userError || !userRole) {
    await supabase.auth.signOut();
    return redirectWithError(
      `Unable to determine your account role. Please contact ${ADMIN_EMAIL}.`,
    );
  }

  const role = userRole as Role;
  const home = ROLE_CONFIG[role]?.home ?? "/";

  return NextResponse.redirect(`${origin}${home}`);
}
