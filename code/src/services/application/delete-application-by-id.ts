import { supabaseClient as supabase } from "@/lib/supabase"

interface DeleteApplicationByIdProps {
    id: string;
}

export const deleteApplicationById = async (props: DeleteApplicationByIdProps) => {
    const { id } = props;
    const {data, error} = await supabase.schema("private").from("ipr_applications").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}