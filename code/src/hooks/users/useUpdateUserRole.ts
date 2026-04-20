import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "@/services/users/update-user-role";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  const { data, isPending, mutateAsync } = useMutation({
    mutationKey: ["update-user-role"],
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { data, isLoading: isPending, updateUserRole: mutateAsync };
}
