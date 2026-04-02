import { markNotificationAsRead } from "@/services/notifications/mark-as-read";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { NotificationsType } from "@/lib/types/notifications";

interface MarkAsReadArgs {
    notifId: string;
}

export function useMarkAsRead() {
    const queryClient = useQueryClient();
    const [activeNotifId, setActiveNotifId] = useState<string | null>(null);
    
    const markOne = useMutation({
        mutationKey: ["read-notification"],
        mutationFn: async (args: MarkAsReadArgs) => {
            setActiveNotifId(args.notifId);
            return await markNotificationAsRead(args)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notifications"]})
        },
        onSettled: () => {
            setActiveNotifId(null);
        }
    }) 

    const markAll = useMutation({
        mutationKey: ["read-all-notifications"],
        mutationFn: async (notifications: NotificationsType["Row"][]) => {
            const unread = notifications.filter((n) => n.read_at === null)

            await Promise.all(
                unread.map((notif) => markNotificationAsRead({notifId: notif.id}))
            )

            return unread;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notifications"]})
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ["notifications"]})
        },
    })

    return {
        markNotificationAsRead: markOne.mutateAsync,
        markAllNotifcationsAsRead: markAll.mutateAsync,

        isMarkingOne: (notifId: string) => 
            markOne.isPending && activeNotifId === notifId,
        isMarkingAll: markAll.isPending
    }
}