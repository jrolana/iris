"use server"

import { RegistrationRequestType } from "@/lib/types/users";
import { supabaseAdmin } from "../../../utils/supabase/admin";

interface PropsInterface {
    userData: RegistrationRequestType["Update"];
    email: string;
}

export async function inviteUser(props: PropsInterface) {
    const {email, userData} = props;

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: userData
    });

    if (error) {
        throw new Error (error.message)
    } 

    return data;
}