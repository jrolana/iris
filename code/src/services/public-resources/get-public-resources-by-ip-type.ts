import { supabaseClient as supabase } from "@/lib/supabase";
import { IpType } from "@/lib/types/ip";

export interface PublicResourceFile {
  name: string;
  fullPath: string;
  viewUrl: string;
  downloadUrl: string;
  size?: number;
  mimetype?: string;
  updatedAt?: string;
}

interface GetPublicResourcesByIpTypeProps {
  ipType: IpType;
}

const BUCKET_NAME = "ipr_public_resources_bucket";

export const getPublicResourcesByIpType = async (
  props: GetPublicResourcesByIpTypeProps,
): Promise<PublicResourceFile[]> => {
  const { ipType } = props;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(ipType, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) throw new Error(error.message);

  const files = (data ?? []).filter((item) => item.metadata !== null);

  return files.map((file): PublicResourceFile => {
    const fullPath = `${ipType}/${file.name}`;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fullPath);

    return {
      name: file.name,
      fullPath,
      viewUrl: publicUrl,
      downloadUrl: `${publicUrl}?download=${encodeURIComponent(file.name)}`,
      size: file.metadata?.size,
      mimetype: file.metadata?.mimetype,
      updatedAt: file.updated_at ?? undefined,
    };
  });
};