import { supabaseClient as supabase } from "@/lib/supabase"

interface DeleteFileByStoragePathProps {
    storage_path: string;
}

export const deleteFileByStoragePath = async (props: DeleteFileByStoragePathProps) => {
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