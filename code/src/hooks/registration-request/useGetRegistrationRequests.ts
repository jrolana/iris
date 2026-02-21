import { getRegistrationRequests } from "@/services/registration-request/get-registration-requests";
import { useQuery } from "@tanstack/react-query";

export function useGetRegistrationRequests() {
    const { data, isLoading } = useQuery(
        {
            queryKey: ["registration-requests"],
            queryFn: getRegistrationRequests
        }
    )

    return { registrationRequests: data, isLoading };
}