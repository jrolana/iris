import { supabaseClient as supabase } from "@/lib/supabase";

interface PropsInterface {
    applicationId: string,
    isLatest?: boolean,
}

export const getApplicationStatuses = async function(props: PropsInterface) {
    const { applicationId, isLatest = false } = props;

    if (!applicationId) {
        throw new Error("Invalid application id.")
    }
    
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
        if (!data[0]) {
            throw new Error("No application with that id.")
        }

        return data[0];
    }
    
    return data;
}
