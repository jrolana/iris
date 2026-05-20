import { supabaseClient as supabase } from "@/lib/supabase";

interface CheckOffRequirementProps {
    applicationId: string,
    requirementId: string,
}

export const checkOffRequirement = async function(props: CheckOffRequirementProps) {
    const { applicationId, requirementId } = props;

    if (!applicationId) {
        throw new Error("Invalid application id.")
    }

    if (!requirementId) {
        throw new Error("Invalid requirement id.")
    }
    
    const { data, error } = await supabase
    .schema("private")
    .from("ipr_requirements")
    .update({ is_accomplished: true })
    .eq("application_id", applicationId)
    .eq("id", requirementId)

    if (error) {
        throw new Error(error.message); 
    }
    
    return data;
}
