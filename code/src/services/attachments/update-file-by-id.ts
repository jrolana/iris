import { supabaseClient as supabase } from "@/lib/supabase"
import { AttachmentType } from "@/lib/types/application";

interface UpdateFileProps {
    id: string;
    attachmentData: Partial<AttachmentType["Update"]>;
}

export const updateFileById = async (props: UpdateFileProps) => {
    const { id, attachmentData } = props;
    const { data, error } = await supabase.schema("private").from('ipr_files').update(attachmentData).eq('id', id).select().single()

    if (error) {
        throw new Error(error.message);
    }

    return data;
}