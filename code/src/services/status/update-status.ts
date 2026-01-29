import { supabaseClient as supabase } from "@/lib/supabase";
import { IprStatusType } from "@/lib/types/status";

interface PropsInterface {
    id: string;
    statusData: Partial<IprStatusType["Update"]>;
}

export const updateStatus = async function(props: PropsInterface) {
    const { id, statusData} = props;
    const { data, error } = await supabase
        .schema("private")
        .from("ipr_statuses")
        .update(statusData)
        .eq("id", id)
        .select()

    if (error) {
        throw new Error(error.message)
    }

    return data;
}