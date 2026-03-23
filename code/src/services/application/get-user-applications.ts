import { supabaseClient as supabase } from "@/lib/supabase";
import { getE2EAuthUser } from "@/lib/e2e-auth";

export const getUserApplicationIds = async function() {
    const e2eUser = getE2EAuthUser();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const user = e2eUser ?? authUser;
    const userId = user?.id;

    if (!userId) {
        throw new Error("Cannot find user id");
    }

    const {data, error} = await supabase
    .schema("private")
    .from("inventors")
    .select("application_id")
    .eq("techgen_id", userId)

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
