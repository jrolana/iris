import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePing } from "@/services/pings/update-ping";

export function useUpdatePing() {
    const queryClient = useQueryClient();

    const {isPending, mutateAsync} = useMutation(
        {
            mutationKey: ["update-ping"],
            mutationFn: updatePing,
            onSuccess: (_data, variables) => {
                const applicationId = variables?.pingData.application_id;
                queryClient.invalidateQueries({queryKey:["get-ping", applicationId]})
            }
        }
    )

    return {isLoading: isPending, updatePing: mutateAsync};
}