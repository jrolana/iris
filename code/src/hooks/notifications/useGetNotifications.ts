import { getNotifications } from "@/services/notifications/get-notifications";
import { useQuery } from "@tanstack/react-query";

export function useGetNotifications() {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications
    })

    return { notifications: data, isLoading, isFetching};
}