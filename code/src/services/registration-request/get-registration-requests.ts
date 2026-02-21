import { supabaseClient as supabase } from "@/lib/supabase";

export const getRegistrationRequests = async function() {
    const { data, error } = await supabase.schema("private").from("user_registration_requests").select().order("requested_at", { ascending: true });

    if (error) {
        throw new Error(error.message)
    }
    
    return data;
}