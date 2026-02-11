import { supabaseClient as supabase } from "@/lib/supabase"

interface DeleteFileByIdProps {
    storage_path: string;
}

export const deleteFileById = async (props: DeleteFileByIdProps) => {
    const { storage_path} = props;
    const { data, error } = await supabase
        .storage
        .from("ipr_files_bucket") 
        .remove([storage_path]);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}