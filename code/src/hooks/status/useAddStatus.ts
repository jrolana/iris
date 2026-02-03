import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStatus } from "@/services/status/add-status";

export function useAddStatus() {
    const queryClient = useQueryClient();
    const { data, isPending, mutateAsync } = useMutation(
        {
            mutationKey: ["new-status"],
            mutationFn: addStatus,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["new-status"]})
            }
        }
    )
    
    return { newStatus: data, isLoading: isPending, addStatus: mutateAsync}
}