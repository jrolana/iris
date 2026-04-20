import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendNotifications } from "@/services/notifications/send-notifications";

export function useSendNotifications() {
    const queryClient = useQueryClient();
    
    const {data, isPending, mutateAsync} = useMutation({
        mutationKey: ["send-notifications"],
        mutationFn: sendNotifications,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notifications"]})
        },
    }) 

    return {sendNotifications: mutateAsync, isLoading: isPending, notification: data};
}