"use server"

import { isE2ETestMode } from "@/lib/e2e-auth";
import { RegistrationRequestType } from "@/lib/types/users";
import { supabaseAdmin } from "../../../utils/supabase/admin";

interface PropsInterface {
    userData: RegistrationRequestType["Update"];
    email: string;
}

export async function inviteUser(props: PropsInterface) {
    const {email, userData} = props;

    if (isE2ETestMode()) {
        return {
            user: {
                email,
                user_metadata: userData,
            },
        };
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: userData
    });

    if (error) {
        throw new Error (error.message)
    } 

    return data;
}
