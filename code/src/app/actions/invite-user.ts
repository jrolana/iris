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

    const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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
