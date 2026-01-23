import { supabaseClient as supabase } from "@/lib/supabase"

interface GetInventorsByAppIdProps {
    id: string;
}

export const getInventorsByAppId = async (props: GetInventorsByAppIdProps) => {
    const { id } = props;
    const {data, error} = await supabase.schema("private").from("inventors").select().eq("application_id", id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}