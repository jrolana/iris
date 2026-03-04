import { toSupabaseDateTime } from "@/lib/helper/format-date";
import { supabaseClient as supabase } from "@/lib/supabase";

interface PropsInterface {
    notifId: string;
}

export const markNotificationAsRead = async (props: PropsInterface) => {
    const {notifId} = props;
    const { data, error } = await supabase
    .schema("private")
    .from("notifications")
    .update({read_at: toSupabaseDateTime(new Date())})
    .eq("id", notifId)
    .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}