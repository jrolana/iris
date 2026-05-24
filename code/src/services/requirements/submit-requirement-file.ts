import { uploadFile } from "@/services/attachments/upload-file";
import { AttachmentType } from "@/lib/types/application";
import { supabaseClient as supabase } from "@/lib/supabase";

interface SubmitRequirementFileProps {
  requirementId: string;
  appId: string;
  file: AttachmentType["Insert"] & { fileObject?: File };
  folderName?: string;
}

export const submitRequirementFile = async function (
  props: SubmitRequirementFileProps,
) {
  const { requirementId, appId, file, folderName } = props;

  if (!requirementId) {
    throw new Error("Invalid requirement id.");
  }

  const uploadResult = await uploadFile({ file, appId, folderName });

  if (!uploadResult.storageId) {
    throw new Error("Requirement uploads must include a storage object id.");
  }

  const { data, error } = await supabase
    .schema("private")
    .from("ipr_requirements")
    .update({
      status: "submitted",
      storage_id: uploadResult.storageId,
    })
    .eq("id", requirementId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return { requirement: data, upload: uploadResult };
};
