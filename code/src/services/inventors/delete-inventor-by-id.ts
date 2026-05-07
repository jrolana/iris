import { supabaseClient as supabase } from "@/lib/supabase"
import { assertApplicationActionAllowed } from "../application/assert-application-action-allowed";

interface DeleteInventorByIdProps {
    id: string;
}

export const deleteInventorById = async (props: DeleteInventorByIdProps) => {
    const { id } = props;
    const { data: inventor, error: inventorError } = await supabase
        .schema("private")
        .from("inventors")
        .select("application_id")
        .eq("id", id)
        .maybeSingle();

    if (inventorError) {
        throw new Error(inventorError.message);
    }

    if (!inventor) {
        throw new Error("Inventor not found.");
    }

    await assertApplicationActionAllowed(inventor.application_id, {
        downgradedMessage:
            "Technology generators can no longer be removed because this application has already been downgraded to a Utility Model.",
        withdrawnMessage:
            "Technology generators can no longer be removed because this application has been withdrawn.",
    });

    const {data, error} = await supabase.schema("private").from("inventors").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
