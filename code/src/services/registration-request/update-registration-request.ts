import { supabaseClient as supabase } from "@/lib/supabase";
import { RegistrationRequestType } from "@/lib/types/users";

interface PropsInterface {
    id: string;
    userData: RegistrationRequestType["Update"];
}

export const updateRegistrationRequest = async function(props: PropsInterface) {
    const { id, userData } = props;

    const { data, error } = await supabase
    .schema("private")
    .from("user_registration_requests")
    .update(userData)
    .eq("id", id);
}