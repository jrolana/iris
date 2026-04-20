"use server";

import { RegistrationRequestType } from "@/lib/types/users";
import { supabaseAdmin } from "../../../utils/supabase/admin";

interface PropsInterface {
  userData: RegistrationRequestType["Update"];
  email: string;
}

export async function inviteUser(props: PropsInterface) {
  const { email, userData } = props;

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
