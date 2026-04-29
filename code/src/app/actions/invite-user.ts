"use server";

import { RegistrationRequestType } from "@/lib/types/users";
import { supabaseAdmin } from "../../../utils/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface PropsInterface {
  userData: RegistrationRequestType["Update"];
  email: string;
}

type InviteUserResult =
  | {
      success: true;
      data: unknown;
    }
  | {
      success: false;
      error: string;
    };

function getInviteErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "There was a problem sending the invitation. Please try again.";
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export async function inviteUser(props: PropsInterface) {
  const { email, userData } = props;

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookieList) =>
            cookieList.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            ),
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be signed in to invite users.",
      } satisfies InviteUserResult;
    }

    const { data: actingUser, error: actingUserError } = await supabase
      .schema("private")
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (actingUserError) {
      return {
        success: false,
        error: actingUserError.message,
      } satisfies InviteUserResult;
    }

    if (actingUser.role !== "admin") {
      return {
        success: false,
        error: "Only admins can invite users.",
      } satisfies InviteUserResult;
    }

    const url = getBaseUrl();
    const inviteExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email: email,
      options: {
        data: userData,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      } satisfies InviteUserResult;
    }

    const inviteLink = `${url}/signin/callback?token_hash=${encodeURIComponent(data.properties.hashed_token)}&type=invite`;

    const { full_name, role } = userData;

    const { data: emailData, error: emailError } =
      await supabaseAdmin.functions.invoke("send-invite-email", {
        body: {
          email: email,
          inviteLink: inviteLink,
          fullName: full_name,
          role: role,
        },
      });

    if (emailError) {
      return {
        success: false,
        error:
          emailError.message ||
          "The invitation link was created, but the email could not be sent.",
      } satisfies InviteUserResult;
    }

    const { data: existingRequest, error: requestLookupError } =
      await supabaseAdmin
        .schema("private")
        .from("user_registration_requests")
        .select("id")
        .eq("email", email)
        .order("requested_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (requestLookupError) {
      return {
        success: false,
        error: requestLookupError.message,
      } satisfies InviteUserResult;
    }

    const approvedAdmission = {
      full_name: userData.full_name ?? null,
      email,
      role: userData.role,
      college_code: userData.college_code ?? null,
      other_college_name: userData.other_college_name ?? null,
      external_institution: userData.external_institution ?? null,
      status: "approved" as const,
      rejection_reason: null,
      invite_expires_at: inviteExpiresAt.toISOString(),
    };

    if (existingRequest?.id) {
      const { error: requestUpdateError } = await supabaseAdmin
        .schema("private")
        .from("user_registration_requests")
        .update(approvedAdmission)
        .eq("id", existingRequest.id);

      if (requestUpdateError) {
        return {
          success: false,
          error: requestUpdateError.message,
        } satisfies InviteUserResult;
      }
    } else {
      const { error: requestInsertError } = await supabaseAdmin
        .schema("private")
        .from("user_registration_requests")
        .insert(approvedAdmission);

      if (requestInsertError) {
        return {
          success: false,
          error: requestInsertError.message,
        } satisfies InviteUserResult;
      }
    }

    return {
      success: true,
      data: emailData,
    } satisfies InviteUserResult;
  } catch (error) {
    console.error("Invite user failed:", error);

    return {
      success: false,
      error: getInviteErrorMessage(error),
    } satisfies InviteUserResult;
  }
}
