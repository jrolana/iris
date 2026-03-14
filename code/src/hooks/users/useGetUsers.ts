import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users/get-users";

export function useGetUsers() {
    const { data, isLoading } = useQuery(
        {
            queryKey: ["users"],
            queryFn: getUsers
        }
    )

    return { data, isLoading };
}