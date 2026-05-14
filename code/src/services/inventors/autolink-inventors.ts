import { supabaseClient as supabase } from "@/lib/supabase"
import { assertApplicationActionAllowed } from "../application/assert-application-action-allowed";

interface AutolinkInventorsProps {
    email: string;
    toBeLinkedInventorId: string;
}

export const autolinkInventors = async (props: AutolinkInventorsProps) => {
    const { email, toBeLinkedInventorId } = props;
    const normalizedEmail = email.trim();
    const { data: inventor, error: inventorError } = await supabase
        .schema("private")
        .from("inventors")
        .select("application_id")
        .eq("id", toBeLinkedInventorId)
        .maybeSingle();

    if (inventorError) {
        throw new Error(inventorError.message);
    }

    if (!inventor) {
        throw new Error("Inventor not found.");
    }

    await assertApplicationActionAllowed(inventor.application_id, {
        downgradedMessage:
            "Technology generators can no longer be linked because this application has already been downgraded to a Utility Model.",
        withdrawnMessage:
            "Technology generators can no longer be linked because this application has been withdrawn.",
    });

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
