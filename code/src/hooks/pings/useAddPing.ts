import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPing } from "@/services/pings/add-ping";


export function useAddPing() {
    const queryClient = useQueryClient();

    const { data, isPending, mutateAsync } = useMutation({
        mutationKey: ["add-ping"],
        mutationFn: addPing,
        onSuccess: (_data, variables) => {
            const applicationId = variables?.pingData?.application_id;
            queryClient.invalidateQueries({ queryKey: ["get-ping", applicationId] });
        }
    })

    return {data, isLoading: isPending, addPing: mutateAsync};
}