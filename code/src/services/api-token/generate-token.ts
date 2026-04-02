import { supabaseClient as supabase } from "@/lib/supabase"
export const generateToken = async () => {
    const token = crypto.randomUUID();
    const { data, error } = await supabase.schema("private").from("api_tokens").insert({ token }).select("token").single();

    if (error) {
        throw new Error(error.message);
    }

    return data.token;
}