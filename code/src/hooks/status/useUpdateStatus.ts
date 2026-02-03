import { updateStatus } from "@/services/status/update-status";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PropsInterface {
    applicationId: string,
}

export function useUpdateStatus(props: PropsInterface) {
    const {applicationId} = props;

    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} = useMutation(
        {
            mutationKey: ["update-status"],
            mutationFn: updateStatus,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["latest-status", applicationId]});
            }
        }
    )

    return { status: data, isLoading: isPending, updateStatus: mutateAsync};
}