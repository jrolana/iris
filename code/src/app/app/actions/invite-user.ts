"use server"

import { supabaseAdmin } from "../../../../utils/supabase/admin";
import { Userchema } from "@/lib/schemas/user";

export async function inviteUser(email: string) {

    const input = Userchema.shape.email.safeParse(email);

    if (input.error) {
        return {success: false, error: input.error.issues[0].message};
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(input.data);

    if (error) {
        return {success: false, error: error.message}
    } 

    return {success: true, error: ""};
}