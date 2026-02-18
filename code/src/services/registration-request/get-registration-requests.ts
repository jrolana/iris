import { supabaseClient as supabase } from "@/lib/supabase";

export const getRegistrationRequests = async function() {
    const { data, error } = await supabase.schema("private").from("user_registration_requests").select();
    console.log(error)
    if (error) {
        throw new Error(error.message)
    }
    console.log("getRegistrationRequests",data);
    return data;
}