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

      if (data?.signedUrl) {
        if (action === 'download') {
          // When downloading, create a temporary link and click it programmatically to prompt download
          const link = document.createElement('a');
          link.href = data.signedUrl;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          // When viewing, open on new tab for now
          // TODO: return signedUrl depending on the view implementation
          window.open(data.signedUrl, '_blank');
        }
      }

      return data as { signedUrl: string };
    }