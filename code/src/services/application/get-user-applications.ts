import { supabaseClient as supabase } from "@/lib/supabase";

export const getUserApplicationIds = async function() {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
        throw new Error("Cannot find user id");
    }

    console.log("userId", userId)

    const {data, error} = await supabase
    .schema("private")
    .from("inventors")
    .select("application_id")
    .eq("techgen_id", userId)

    if (error) {
        throw new Error(error.message);
    }

    console.log("getUserApplicationIds", data)

    return data;
}