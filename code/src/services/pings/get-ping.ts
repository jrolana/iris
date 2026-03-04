import { supabaseClient as supabase } from "@/lib/supabase";

interface PropsInterface {
    applicationId: string;
}

export const getPing = async function(props: PropsInterface) {
    const { applicationId } = props;

    const { data, error } = await supabase
    .schema("private")
    .from("pings")
    .select()
    .eq("application_id", applicationId)
    .order("created_at", {ascending: false})
    .limit(1)
    .single();

    if (error) {
        throw new Error(error.message)
    }
    
    return data;
}