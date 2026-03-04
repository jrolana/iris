import { supabaseClient as supabase } from "@/lib/supabase";
import { PingType } from "@/lib/types/ping";

interface PropsInterface {
    pingData: PingType["Insert"];
}
export const addPing = async function(props: PropsInterface) {
    const { pingData } = props;
    const { data, error } = await supabase 
    .schema("private")
    .from("pings")
    .insert(pingData)
    .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}