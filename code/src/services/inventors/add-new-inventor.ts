import { supabaseClient as supabase } from "@/lib/supabase"
import { InventorType } from "@/lib/types/application";
import { assertApplicationActionAllowed } from "../application/assert-application-action-allowed";

interface AddNewInventorProps {
    inventorData: InventorType["Insert"];
}

export const addNewInventor = async (props: AddNewInventorProps) => {
    const { inventorData } = props;
    await assertApplicationActionAllowed(inventorData.application_id, {
        downgradedMessage:
            "Technology generators can no longer be added because this application has already been downgraded to a Utility Model.",
        withdrawnMessage:
            "Technology generators can no longer be added because this application has been withdrawn.",
    });

    const {data, error} = await supabase.schema("private").from("inventors").insert(inventorData).select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
