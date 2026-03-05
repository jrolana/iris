import { supabaseClient as supabase } from "@/lib/supabase"
import { CollegeUnitType } from "@/lib/types/college-units";
import { StatusType } from "@/lib/types/ip";


interface GetApplicationsByQueryProps{
    title?: string ;
    status?: StatusType;
    colleges?: CollegeUnitType[];
    techgens?: string[];
}

export const getApplicationsByQuery = async (props: GetApplicationsByQueryProps) => {
    const { title, status, colleges, techgens } = props;
    const { data, error } = await supabase.rpc("search_applications", {
        p_title: title,
        p_status: status,
        p_colleges: colleges,
        p_techgens: techgens,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}