import { supabaseClient as supabase } from "@/lib/supabase"

export const deleteApplication = async (id: string) => {
    const {data, error} = await supabase.schema("private").from("ipr_applications").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}