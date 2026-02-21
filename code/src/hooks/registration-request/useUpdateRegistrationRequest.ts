import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRegistrationRequest } from "@/services/registration-request/update-registration-request";

export function useUpdateRegistrationRequest() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} = useMutation({
        mutationKey: ["update-registration-request"],
        mutationFn: updateRegistrationRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["registration-requests"]})
        }
    })

    return {data, isLoading: isPending, updateRegistrationRequest: mutateAsync};
}