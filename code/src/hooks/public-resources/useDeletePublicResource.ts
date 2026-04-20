import { deletePublicResource } from "@/services/public-resources/delete-public-resource";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePublicResource() {
  const queryClient = useQueryClient();

  const { data, isPending, mutateAsync } = useMutation({
    mutationKey: ["public-resources", "delete"],
    mutationFn: deletePublicResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-resources"] });
    },
  });

  return { data, isLoading: isPending, deletePublicResource: mutateAsync };
}
