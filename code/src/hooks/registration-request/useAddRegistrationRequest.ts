import { addRegistrationRequest } from "@/services/registration-request/add-registration-request";
import { useMutation } from "@tanstack/react-query";

export function useAddRegistrationRequest() {
    const {data, isPending, mutateAsync} = useMutation({
        mutationKey: ["add-registration-request"],
        mutationFn: addRegistrationRequest,
    })

    return {data, isLoading: isPending, addRegistrationRequest: mutateAsync};
}