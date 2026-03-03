import { supabaseClient as supabase } from "@/lib/supabase"

interface DeleteInventorByIdProps {
    id: string;
}

export const deleteInventorById = async (props: DeleteInventorByIdProps) => {
    const { id } = props;
    const {data, error} = await supabase.schema("private").from("inventors").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}