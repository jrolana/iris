import { supabaseClient as supabase } from "@/lib/supabase"
import { CollegeUnitType } from "@/lib/types/college-units";
import { StatusType } from "@/lib/types/ip";


interface GetApplicationsByQueryProps{
    title?: string ;
    status?: StatusType;
    colleges?: CollegeUnitType[];
    techgens?: string[];
    ip_type?: string;
}

export const getApplicationsByQuery = async (props: GetApplicationsByQueryProps) => {
    const { title, status, colleges, techgens, ip_type } = props;
    const { data, error } = await supabase.rpc("search_applications", {
        p_title: title,
        p_status: status,
        p_colleges: colleges,
        p_techgens: techgens,
        p_ip_type: ip_type,
    });


    if (error) {
        alert("An error occurred while fetching applications: " + error.message);
        throw new Error(error.message);
    }

    return data;
}