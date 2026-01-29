import { useMutation } from "@tanstack/react-query";
import { addStatus } from "@/services/status/add-status";

export function useAddStatus() {
    const { data, isPending, mutateAsync } = useMutation(
        {
            mutationKey: ["new-status"],
            mutationFn: addStatus,
        }
    )
    
    return { newStatus: data, isLoading: isPending, addStatus: mutateAsync}
}