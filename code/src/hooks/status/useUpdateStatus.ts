import { updateStatus } from "@/services/status/update-status";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateStatus() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} = useMutation(
        {
            mutationKey: ["update-status"],
            mutationFn: updateStatus,
            onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["update-status"]});
        }
        }
    )

    return { status: data, isLoading: isPending, updateStatus: mutateAsync};
}