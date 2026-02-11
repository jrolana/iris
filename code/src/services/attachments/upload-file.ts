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
    const newId = crypto.randomUUID();
    const fullPath = `${appId}/${file.file_name}/${newId}`;

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
        contentType: file.fileObject.type,
        upsert: true,
    })

    if (error) {
        throw new Error(error.message);
    }

    const { error: dbError } = await supabase
    .schema('private')
    .from('ipr_files')
    .update({
      file_description: file.file_description,
      comments: file.comments,
      file_type: file.file_type,
      // explicitly update file_name again just to be sure
      file_name: file.file_name 
    })
    .eq('storage_path', fullPath) // Match the path of the exact file uploaded
    .select();

  if (dbError) {
    throw new Error("File uploaded but failed to update database: " + dbError.message);
  }

    return { data, error};
}