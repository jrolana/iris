import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitRequirementFile } from "@/services/requirements/submit-requirement-file";

export function useSubmitRequirementFile() {
  const queryClient = useQueryClient();
  const { data, isPending, mutateAsync } = useMutation({
    mutationKey: ["requirements", "submit-file"],
    mutationFn: submitRequirementFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requirements"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    result: data,
    isLoading: isPending,
    submitRequirementFile: mutateAsync,
  };
}
