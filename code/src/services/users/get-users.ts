import { supabaseClient as supabase } from "@/lib/supabase";

export const getUsers = async function() {
    const { data, error } = await supabase.schema("private").from("users").select();

    if (error) {
        throw new Error(error.message)
    }
    
    return data;
}