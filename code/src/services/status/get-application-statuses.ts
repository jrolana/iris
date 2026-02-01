import { supabaseClient as supabase } from "@/lib/supabase";

interface PropsInterface {
    applicationId: string,
    isLatest?: boolean,
}

export const getApplicationStatuses = async function(props: PropsInterface) {
    const { applicationId, isLatest = false } = props;
    
    const { data, error } = await supabase
    .schema("private")
    .from("ipr_statuses")
    .select()
    .eq("application_id", applicationId)
    .order("created_at", {ascending: false});

    if (error) {
        throw new Error(error.message); 
    }

    if (isLatest) {
        return data[0] ?? null;
    }
    
    return data;
}
