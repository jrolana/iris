import { supabaseClient as supabase } from "@/lib/supabase"

interface AutolinkInventorsProps {
    email: string;
    toBeLinkedInventorId: string;
}

export const autolinkInventors = async (props: AutolinkInventorsProps) => {
    const { email, toBeLinkedInventorId } = props;
    const normalizedEmail = email.trim();
    const { data, error } = await supabase.rpc("search_users_for_linking", {
        search_query: normalizedEmail,
        excluded_ids: [],
    });

    if (error) {
        throw new Error(error.message);
    }

    const user = data?.find((item) => item.email === normalizedEmail);

    if (!user) {
        throw new Error("No user found with the provided email.");
    }

    const { id: techgen_id, full_name, email: user_email, college_code, external_institution, other_college_name } = user;

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
