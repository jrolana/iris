import { supabaseClient as supabase } from "@/lib/supabase";

interface GetApplicationRequirementsProps {
    applicationId: string,
}

export const getApplicationRequirements = async function(props: GetApplicationRequirementsProps) {
    const { applicationId } = props;

    if (!applicationId) {
        throw new Error("Invalid application id.")
    }
    
    const { data, error } = await supabase
    .schema("private")
    .from("ipr_requirements")
    .select()
    .eq("application_id", applicationId)
    .order("is_accomplished", {ascending: true});

    if (error) {
        throw new Error(error.message); 
    }
    return data;
}
