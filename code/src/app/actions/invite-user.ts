"use server";

import { RegistrationRequestType } from "@/lib/types/users";
import { supabaseAdmin } from "../../../utils/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface PropsInterface {
  userData: RegistrationRequestType["Update"];
  email: string;
}

export async function inviteUser(props: PropsInterface) {
  const { email, userData } = props;

  
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
    throw new Error("You must be signed in to invite users.");
  }

  const { data: actingUser, error: actingUserError } = await supabase
    .schema("private")
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (actingUserError) {
    throw new Error(actingUserError.message);
  }

  if (actingUser.role !== "admin") {
    throw new Error("Only admins can invite users.");
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
    throw new Error(error.message);
  }

  const inviteLink = `${url}/signin/callback?token_hash=${encodeURIComponent(data.properties.hashed_token)}&type=invite`;

  const {full_name, role} = userData;

  const { data: emailData, error: emailError } =
    await supabaseAdmin.functions.invoke("send-invite-email", {
      body: {
        email: email,
        inviteLink: inviteLink,
        fullName: full_name, 
        role: role 
      },
    });

  if (emailError) {
    throw new Error(emailError.message);
  }

  return emailData;
}
