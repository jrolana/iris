import { supabaseClient as supabase } from "@/lib/supabase"
import { AttachmentType } from "@/lib/types/application";


interface UploadFileProps {
    file: AttachmentType["Insert"] & {fileObject?: File};
    appId: string;
}   

export const uploadFile = async (props: UploadFileProps) => {
    const { file, appId } = props;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    if (!appId) {
    throw new Error("Application ID is missing. Cannot upload file.");
  }

    const fullPath = `${appId}/${file.file_name}`;

    if (!file.fileObject) {
        // This means that the file is a link
        // No need to upload to storage, just insert into the database
        const {data, error} = await supabase.schema("private").from('ipr_files').insert({
            application_id: appId,
            file_name: file.file_name,
            file_type: file.file_type,
            storage_path: file.file_name,
            file_description: file.file_description,
            owner_id: user.id,}
        );
        if (error) {
            throw new Error(error.message);
        }
        return { data, error};
    }

    // Otherwise, proceed with file upload
    const { data, error } = await supabase.storage.from('ipr_files_bucket').upload(
        fullPath, file.fileObject, {
        // upsert: true,
        contentType: file.fileObject.type,
        // This metadata will be used by the trigger function to populate other fields in the ipr_files table
        metadata: {
        description: file.file_description, 
        comments: file.comments,     
        file_name: file.fileObject.name,
        file_type: file.file_type,    
        }
    })

    if (error) {
        throw new Error(error.message);
    }

    return { data, error};
}