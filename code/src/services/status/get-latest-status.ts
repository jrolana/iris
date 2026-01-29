import { supabaseClient as supabase } from "@/lib/supabase";
import { IprStatusType } from "@/lib/types/status";

interface PropsInterface {
    applicationId: string,
}

export const getLatestStatusById = async function(props: PropsInterface) {
    const { applicationId } = props;
    const { data, error } = await supabase
    .schema("private")
    .from("ipr_statuses")
    .select()
    .eq("application_id", applicationId)
    .order("created_at", {ascending: false})
    .limit(1)   // returns 1 match
    .single()

    if (error) {
        throw new Error(error.message); 
    }
    console.log("returned ", data)
    return data;
}