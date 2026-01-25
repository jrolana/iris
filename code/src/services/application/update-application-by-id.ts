import { supabaseClient as supabase } from "@/lib/supabase"
import { ApplicationType } from "@/lib/types/application";

interface UpdateApplicationProps {
    id: string;
    applicationData: Partial<ApplicationType["Update"]>;
}

export const updateApplicationById = async (props: UpdateApplicationProps) => {
    const { id, applicationData } = props;
    const { data, error } = await supabase.schema("private").from('ipr_applications').update(applicationData).eq('id', id).select()

    if (error) {
        throw new Error(error.message);
    }

    return data;
}