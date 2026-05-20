import { supabaseClient as supabase } from "@/lib/supabase";

interface AddRequirementsProps {
    applicationId: string,
    requirements: string[],
}

export const addRequirements = async function(props: AddRequirementsProps) {
    const { applicationId, requirements } = props;

    if (!applicationId) {
        throw new Error("Invalid application id.")
    }
    
    const { data, error } = await supabase
    .schema("private")
    .from("ipr_requirements")
    .insert(
        requirements.map((req) => ({
            application_id: applicationId,
            requirement: req,
            is_accomplished: false
        }))
    );

    if (error) {
        throw new Error(error.message); 
    }
    
    return data;
}
