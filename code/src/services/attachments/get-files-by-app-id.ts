import { supabaseClient as supabase } from "@/lib/supabase"

interface GetFilesByAppIdProps {
    id: string;
}

export const getFilesByAppId = async (props: GetFilesByAppIdProps) => {
    const { id } = props;
    const {data, error} = await supabase.schema("private").from("ipr_files").select().eq("application_id", id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}