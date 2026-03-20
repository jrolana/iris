import { supabaseClient as supabase } from "@/lib/supabase"

interface AutolinkInventorsProps {
    email: string;
    toBeLinkedInventorId: string;
}

export const autolinkInventors = async (props: AutolinkInventorsProps) => {
    const { email, toBeLinkedInventorId } = props;
    const { data, error } = await supabase.schema('private').from("users").select("*").eq("email", email.trim()).maybeSingle();

    if (error) {
        alert("Failed to fetch user data. Please try again. " + email);
        throw new Error(error.message);
    }

    if (!data) {
        
        alert("Failed to fetch user data. Please try again. " + email);
        throw new Error("No user found with the provided email.");
    }

    const { id: techgen_id, full_name, email: user_email, college_code, external_institution, other_college_name } = data;

    const { data: updatedInventorData, error: updateError } = await supabase.schema('private').from("inventors").update({
        techgen_id,
        full_name,
        email: user_email,
        college_code,
        external_institution,
        other_college_name
    }).eq("id", toBeLinkedInventorId);

    if (updateError) {
        throw new Error(updateError.message);
    }

    return updatedInventorData;
}