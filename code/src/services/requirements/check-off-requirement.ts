import { supabaseClient as supabase } from "@/lib/supabase";

interface CheckOffRequirementProps {
    requirementId: string,
}

export const checkOffRequirement = async function(props: CheckOffRequirementProps) {
    const {  requirementId } = props;
    
    if (!requirementId) {
        throw new Error("Invalid requirement id.")
    }
    
    const { data, error } = await supabase
    .schema("private")
    .from("ipr_requirements")
    .update({ is_accomplished: true })
    .eq("id", requirementId)

    if (error) {
        throw new Error(error.message); 
    }
    
    return data;
}
