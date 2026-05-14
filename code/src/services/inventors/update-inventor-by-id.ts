import { supabaseClient as supabase } from "@/lib/supabase"
import { InventorType } from "@/lib/types/application";
import { assertApplicationActionAllowed } from "../application/assert-application-action-allowed";

interface UpdateInventorProps {
    id: string;
    inventorData: Partial<InventorType["Update"]>;
}

export const updateInventorById = async (props: UpdateInventorProps) => {
    const { id, inventorData } = props;
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
            "Technology generators can no longer be linked because this application has already been downgraded to a Utility Model.",
        withdrawnMessage:
            "Technology generators can no longer be linked because this application has been withdrawn.",
    });

    const { data, error } = await supabase.schema("private").from('inventors').update(inventorData).eq('id', id).select().maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("Inventor not found.");
    }

    return data;
}
