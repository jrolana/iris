import { uploadPublicResource as uploadPublicResourceAction } from "@/app/actions/public-resources";
import { IpType } from "@/lib/types/ip";

interface UploadPublicResourceProps {
  ipType: IpType;
  file: File;
}

export const uploadPublicResource = async function (
  props: UploadPublicResourceProps,
) {
  const { ipType, file } = props;

  const formData = new FormData();
  formData.append("ipType", ipType);
  formData.append("file", file);

  return uploadPublicResourceAction(formData);
};
