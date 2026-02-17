import { RegistrationRequestType } from "@/lib/types/users";
import { supabaseClient as supabase } from "@/lib/supabase";

interface PropsInterface {
    userData: RegistrationRequestType["Insert"];
}

export async function addRegistrationRequest(props: PropsInterface) {
    const { userData } = props;

    const { data, error } = await supabase.rpc('submit_registration_request', {
        p_full_name: userData.full_name,
        p_email: userData.email,
        p_role: userData.role,
        p_college_code: userData.college_code,
        p_other_college_name: userData.other_college_name,
        p_external_institution: userData.external_institution,
    });
    
    if (error) {
        throw new Error(error.message)
    }

    return data;
}