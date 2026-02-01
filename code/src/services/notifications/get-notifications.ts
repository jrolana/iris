import { supabaseClient as supabase } from "@/lib/supabase";

export const getNotifications = async function() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not found.");
    }

    const userId = user.id;

    const {data, error} = await supabase.schema("private").from("notifications").select().eq("receiver_id", userId).order("created_at", {ascending: false});

    if (error) {
        throw new Error(error.message);
    }

    return data;
}