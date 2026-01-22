"use server"

import { supabaseAdmin } from "../../../../utils/supabase/admin";

export async function inviteUser(email: string) {

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (error) {
        return {success: false, error: error.message}
    } 

    return {success: true, error: ""};
}