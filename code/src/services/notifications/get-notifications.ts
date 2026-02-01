import { supabaseClient as supabase } from "@/lib/supabase";

export const getNotifications = async function() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not found.");
    }

    const userId = user.id;

    console.log("userId", userId);

    const {data, error} = await supabase.schema("private").from("notifications").select().eq("receiver_id", userId);

    if (error) {
        throw new Error(error.message);
    }

    console.log("notifications data", data);
    return data;
}