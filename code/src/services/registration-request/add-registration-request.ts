import { RegistrationRequestType } from "@/lib/types/users";
import { supabaseClient as supabase } from "@/lib/supabase";

interface PropsInterface {
    userData: RegistrationRequestType["Insert"];
}

export const addRegistrationRequest = async function(props: PropsInterface) {
    const { userData } = props;

    const { data, error } = await supabase.rpc('submit_registration_request', {
        p_full_name: userData.full_name,
        p_email: userData.email,
        p_role: userData.role,
        p_college_code: userData.college_code ?? undefined,
        p_other_college_name: userData.other_college_name ?? undefined,
        p_external_institution: userData.external_institution ?? undefined,
    });
    
    if (error) {
        if (error.code) {
            throw {type: "supabase", code: error.code, message: error.message}
        }
        throw {type: "custom", code: null, message: error.message}
    }

    return data;
}