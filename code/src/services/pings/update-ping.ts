import { supabaseClient as supabase } from "@/lib/supabase";
import { PingType } from "@/lib/types/ping";

interface PropsInterface {
    pingData: PingType["Update"];
    pingId: string;
}

export const updatePing = async function(props: PropsInterface) {
    const { pingData, pingId } = props;

    const { data, error } = await supabase 
    .schema("private")
    .from("pings")
    .update(pingData)
    .eq("id", pingId)
    .select();

    if (error) {
        throw new Error(error.message)
    }

    return data;
}