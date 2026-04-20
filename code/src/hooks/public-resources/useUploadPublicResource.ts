import { uploadPublicResource } from "@/services/public-resources/upload-public-resource";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadPublicResource() {
  const queryClient = useQueryClient();

  const { data, isPending, mutateAsync } = useMutation({
    mutationKey: ["public-resources", "upload"],
    mutationFn: uploadPublicResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-resources"] });
    },
  });

  return { data, isLoading: isPending, uploadPublicResource: mutateAsync };
}
