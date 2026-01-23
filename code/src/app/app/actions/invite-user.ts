"use server"

import { supabaseAdmin } from "../../../../utils/supabase/admin";
import { InviteUserType, InviteUserSchema } from "@/lib/schemas/user";

export async function inviteUser(input: InviteUserType) {

    const inputValidation = InviteUserSchema.safeParse(input);

    if (!inputValidation.success) {
        return {success: false, error: inputValidation.error.issues[0].message};
    }

    const { email, role } = inputValidation.data;

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {role: role}
    });

    if (error) {
        return {success: false, error: error.message}
    } 

    return {success: true, error: ""};
}