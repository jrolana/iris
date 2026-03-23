import { supabaseClient as supabase } from "@/lib/supabase";
import { getE2EAuthUser } from "@/lib/e2e-auth";

export const getNotifications = async function() {
    const e2eUser = getE2EAuthUser();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const user = e2eUser ?? authUser;

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
