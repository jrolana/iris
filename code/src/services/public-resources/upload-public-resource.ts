import { logPublicResourceUpload } from "@/app/actions/public-resources";
import { sanitizeFileName } from "@/lib/helper/sanitize-input";
import { supabaseClient as supabase } from "@/lib/supabase";
import { IpType } from "@/lib/types/ip";

interface UploadPublicResourceProps {
  ipType: IpType;
  file: File;
}

export const uploadPublicResource = async function (
  props: UploadPublicResourceProps,
) {
  const { ipType, file } = props;
  const filePath = `${ipType}/${sanitizeFileName(file.name)}`;

  const { data, error } = await supabase.storage
    .from("ipr_public_resources_bucket")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  await logPublicResourceUpload({
    ipType,
    filePath,
    contentType: file.type || null,
  });

  return data;
};
