import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptRequirement } from "@/services/requirements/accept-requirement";

export function useAcceptRequirement() {
  const queryClient = useQueryClient();
  const { data, isPending, mutateAsync } = useMutation({
    mutationKey: ["requirements", "accept"],
    mutationFn: acceptRequirement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requirements"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { report: data, isLoading: isPending, acceptRequirement: mutateAsync };
}
