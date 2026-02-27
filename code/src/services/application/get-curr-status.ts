import { supabaseClient as supabase } from "@/lib/supabase"

interface GetCurrStatusProps {
    id: string | null;
}

export const getCurrStatus = async (props: GetCurrStatusProps) => {
    const { id } = props;
    if (!id) {
        throw new Error("Status ID is null or undefined");
    }
    const {data, error} = await supabase.schema("private").from("ipr_statuses").select().eq("id", id).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}