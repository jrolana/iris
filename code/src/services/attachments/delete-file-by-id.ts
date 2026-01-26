import { supabaseClient as supabase } from "@/lib/supabase"

interface DeleteFileByIdProps {
    id: string;
}

export const deleteFileById = async (props: DeleteFileByIdProps) => {
    const { id } = props;
    const {data, error} = await supabase.schema("private").from("ipr_files").delete().eq("id", id).select().single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}