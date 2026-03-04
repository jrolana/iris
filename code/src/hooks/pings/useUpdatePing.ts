import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePing } from "@/services/pings/update-ping";

interface PropsInterface {
    applicationId?: string
} 

export function useUpdatePing(props: PropsInterface = {}) {
    const { applicationId } = props; 
    const queryClient = useQueryClient();

    const {isPending, mutateAsync} = useMutation(
        {
            mutationKey: ["update-ping"],
            mutationFn: updatePing,
            onSuccess: () => {
                applicationId ? queryClient.invalidateQueries({queryKey:["ping", applicationId]}) : queryClient.invalidateQueries({queryKey:["pings"]})
            }
        }
    )

    return {isLoading: isPending, updatePing: mutateAsync};
}