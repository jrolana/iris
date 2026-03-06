import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPing } from "@/services/pings/add-ping";


export function useAddPing() {
    const queryClient = useQueryClient();

    const { data, isPending, mutateAsync } = useMutation({
        mutationKey: ["add-ping"],
        mutationFn: addPing,
        onSuccess: (_data, variables) => {
            const applicationId = variables?.pingData?.application_id;
            const stageDelayed = variables?.pingData?.stage_delayed;
            const stepDelayed = variables?.pingData?.step_delayed;
            queryClient.invalidateQueries({queryKey: ["ping", applicationId, stageDelayed, stepDelayed]});
        }
    })

    return {data, isLoading: isPending, addPing: mutateAsync};
}