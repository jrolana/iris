import { supabaseClient as supabase } from "@/lib/supabase";
import { IprStatusType } from "@/lib/types/status";

interface PropsInterface {
    id: string,
}

export const getStatus = async function(props: PropsInterface) {
    const {id } = props;
    const { data, error } = await supabase
    .schema("private")
    .from("ipr_statuses")
    .select()
    .eq("id", id)
    .single()

    if (error) {
        throw new Error(error.message); 
    }

    return data;
}