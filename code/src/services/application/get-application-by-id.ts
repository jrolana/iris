import { supabaseClient as supabase } from "@/lib/supabase"

interface GetApplicationByIdProps {
    id: string;
}

export const getApplicationById = async (props: GetApplicationByIdProps) => {
    const { id } = props;
    const {data, error} = await supabase.schema("private").from("ipr_applications").select().eq("id", id).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}