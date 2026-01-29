import { getStatus } from "@/services/status/get-status";
import { useMutation } from "@tanstack/react-query";

export function useGetStatus() {
    const { data, isPending, mutateAsync } = useMutation(
        {
            mutationKey: ["status"],
            mutationFn: getStatus,
        }
    )

    return { status: data, isLoading: isPending, getStatus: mutateAsync};
}