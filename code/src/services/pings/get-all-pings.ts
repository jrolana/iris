import { supabaseClient as supabase } from "@/lib/supabase";

export const getAllPings = async function() {
    const { data, error } = await supabase
    .schema("private")
    .from("pings")
    .select()
    .order("created_at", {ascending: false});

    if (error) {
        throw new Error(error.message)
    }
    
    return data;
}