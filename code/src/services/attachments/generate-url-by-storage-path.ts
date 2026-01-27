import { supabaseClient as supabase } from "@/lib/supabase"

interface GenerateUrlByStoragePathProps {
    storagePath: string;
    fileName: string;
    action: 'view' | 'download';
}

export const  generateUrlByStoragePath = async (props: GenerateUrlByStoragePathProps) => {
    const {storagePath, fileName, action} = props;
    
      const { data, error } = await supabase
        .storage
        .from('ipr_files_bucket')
        .createSignedUrl(storagePath, 60, { // URL valid for 60 seconds, for safety purposes
          // If 'download' is true, Supabase adds headers to force a download.
          download: action === 'download' ? fileName : false,
        });

      if (error) throw new Error(error.message);


      return data.signedUrl;
    }