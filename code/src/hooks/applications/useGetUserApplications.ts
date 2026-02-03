import { getUserApplicationIds } from "@/services/application/get-user-applications";
import { useQuery } from "@tanstack/react-query";

export function useGetUserApplicationIds() {
    const { data, isLoading } = useQuery({
        queryKey: ['user-applications'],
        queryFn: getUserApplicationIds
    })

    return {userApplicationIds: data, isLoading}
}