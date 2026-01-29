import { updateStatus } from "@/services/status/update-status";
import { useMutation } from "@tanstack/react-query";

export function useUpdateStatus() {
    const {data, isPending, mutateAsync} = useMutation(
        {
            mutationKey: ["update-status"],
            mutationFn: updateStatus,
        }
    )

    return { status: data, isLoading: isPending, updateStatus: mutateAsync};
}