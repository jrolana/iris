import { supabaseClient as supabase } from "@/lib/supabase"
import { AttachmentType } from "@/lib/types/application";

interface GetFilesByAppIdProps {
    id: string;
}

export const getFilesByAppId = async (props: GetFilesByAppIdProps) => {
    const { id } = props;
    const {data, error} = await supabase.schema("private").from("ipr_files").select().eq("application_id", id);

    if (error) {
        throw new Error(error.message);
    }

    if (!data) return [];

    // group files by folder name (appId/folderName)
    const groupedObject = data.reduce((acc: Record<string, AttachmentType["Row"][]>, file) => {
    const pathSegments = file.storage_path.split('/');
    const folderName = pathSegments[1]; 

    // if folder name does't exist in the acc obj, create new array for it
    if (!acc[folderName]) {
        acc[folderName] = [];
    }

    // push the file to the group array
    acc[folderName].push(file);
    return acc;
    }, {});


    
    // sort each group by modified date, descending. first element is latest version
    const result = Object.values(groupedObject).map((fileGroup) => {
        return fileGroup.sort((a, b) => {
            return new Date(b.modified_at!).getTime() - new Date(a.modified_at!).getTime();
        });
    });

    console.log(JSON.stringify(result, null, 2))

  return result;
}