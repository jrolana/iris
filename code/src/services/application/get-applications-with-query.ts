import { supabaseClient as supabase } from "@/lib/supabase"
import { CollegeUnitType } from "@/lib/types/college-units";
import { StatusType } from "@/lib/types/ip";


interface GetApplicationsByQueryProps{
    title?: string ;
    statuses?: StatusType[];
    colleges?: CollegeUnitType[];
    techgens?: string[];
    ip_types?: string[];
}

export const getApplicationsByQuery = async (props: GetApplicationsByQueryProps) => {
    const { title, statuses, colleges, techgens, ip_types } = props;
    const { data, error } = await supabase.rpc("search_applications", {
        p_title: title,
        p_statuses: statuses,
        p_colleges: colleges,
        p_techgens: techgens,
        p_ip_types: ip_types,
    });


    if (error) {
        alert("An error occurred while fetching applications: " + error.message);
        throw new Error(error.message);
    }

    return data;
}