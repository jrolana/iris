import { supabaseClient as supabase } from "@/lib/supabase";
import { RequirementWithAttachment } from "@/lib/types/requirements";

interface GetApplicationRequirementsProps {
  applicationId: string;
}

export const getApplicationRequirements = async function (
  props: GetApplicationRequirementsProps,
): Promise<RequirementWithAttachment[]> {
  const { applicationId } = props;

  if (!applicationId) {
    throw new Error("Invalid application id.");
  }

  const { data, error } = await supabase
    .schema("private")
    .from("ipr_requirements")
    .select()
    .eq("application_id", applicationId)
    .order("status", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  const storageIds = data
    .map((requirement) => requirement.storage_id)
    .filter((storageId): storageId is string => Boolean(storageId));

  if (storageIds.length === 0) {
    return data.map((requirement) => ({
      ...requirement,
      attachment: null,
    }));
  }

  const { data: files, error: filesError } = await supabase
    .schema("private")
    .from("ipr_files")
    .select()
    .in("storage_id", storageIds);

  if (filesError) {
    throw new Error(filesError.message);
  }

  const filesByStorageId = new Map(
    (files ?? [])
      .filter((file) => file.storage_id)
      .map((file) => [file.storage_id!, file]),
  );

  return data.map((requirement) => ({
    ...requirement,
    attachment: requirement.storage_id
      ? (filesByStorageId.get(requirement.storage_id) ?? null)
      : null,
  }));
};
