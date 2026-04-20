import { deletePublicResource as deletePublicResourceAction } from "@/app/actions/public-resources";

interface DeletePublicResourceProps {
  fullPath: string;
}

export const deletePublicResource = async function (
  props: DeletePublicResourceProps,
) {
  const { fullPath } = props;

  return deletePublicResourceAction(fullPath);
};
