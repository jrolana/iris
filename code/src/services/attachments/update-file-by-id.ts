import { supabaseClient as supabase } from "@/lib/supabase"
import { AttachmentType } from "@/lib/types/application";

interface UdateAttachmentProps {
    id: string;
    attachmentData: Partial<AttachmentType["Update"]>;
}

export const updateAttachmentById = async (props: UdateAttachmentProps) => {
    const { id, attachmentData } = props;
    const { data, error } = await supabase.schema("private").from('ipr_files').update(attachmentData).eq('id', id).select()

    if (error) {
        throw new Error(error.message);
    }

    return data;
}