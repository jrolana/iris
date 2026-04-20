import { supabaseClient as supabase } from "@/lib/supabase"
import { Database } from "@/lib/types/supabase";

interface AcceptRejectInventorProps {
    inventorId: string;
    status: Database["private"]["Enums"]["inventorstatustype"];
}

export const acceptRejectInventor = async (props: AcceptRejectInventorProps) => {
    const { inventorId, status } = props;
    const { data, error } = await supabase.schema("private").from("inventors").update({ status }).eq("id", inventorId).select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}