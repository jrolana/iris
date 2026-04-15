import { supabaseClient as supabase } from "@/lib/supabase"

interface AcceptRejectInventorProps {
    inventorId: string;
    status: "member" | "non-member";
}

export const acceptRejectInventor = async (props: AcceptRejectInventorProps) => {
    const { inventorId, status } = props;
    const { data, error } = await supabase.schema("private").from("inventors").update({ status }).eq("id", inventorId).select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}