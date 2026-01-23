import { supabaseClient as supabase } from "@/lib/supabase"

import { ApplicationType } from "@/lib/types/application";

interface CreateApplicationProps {
    applicationData: ApplicationType["Insert"];
}   

export const createApplication = async (props: CreateApplicationProps) => {
    const { applicationData } = props;
    const {data, error} = await supabase.schema("private").from("ipr_applications").insert(applicationData).select().single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}