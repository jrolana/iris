import { supabaseClient as supabase } from "@/lib/supabase"

export const getApplications = async () => {
    const {data, error} = await supabase.schema("private").from("ipr_applications").select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}