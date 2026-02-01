import { markNotificationAsRead } from "@/services/notifications/mark-as-read";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMarkAsRead() {

    const queryClient = useQueryClient();
    
    const {data, isPending, mutateAsync} = useMutation({
        mutationKey: ["read-notification"],
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["read-notification"]})
        }
    }) 

    return {data, isLoading : isPending, markNotificationAsRead: mutateAsync};
}