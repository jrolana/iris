import { supabaseClient as supabase } from "@/lib/supabase";

interface SendNotificationsProps {
    receiverIds: string[];
    content: string;
    title: string;
    applicationId: string;
}

export const sendNotifications = async (props: SendNotificationsProps) => {
    const {receiverIds, content, title, applicationId} = props;
    const { data, error } = await supabase
    .schema("private")
    .from("notifications").insert(
        receiverIds.map((receiverId) => ({
            receiver_id: receiverId,
            content,
            title,
            application_id: applicationId,
        }))
    )

    if (error) {
        alert(error.message)
        throw new Error(error.message);
    }

    return data;
}