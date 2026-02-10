import { supabaseClient as supabase } from "@/lib/supabase"

import { ApplicationType, InventorType } from "@/lib/types/application";

interface CreateApplicationProps {
    applicationData: ApplicationType["Insert"];
    inventorsData: InventorType["Insert"][];
}   

export const createApplication = async (props: CreateApplicationProps) => {
    const { applicationData, inventorsData } = props;
    const {data: appId, error} = await supabase.rpc('create_application_with_inventors', {
      p_project_title: applicationData.project_title,
      p_ip_type: applicationData.ip_type,
      p_funding_source: applicationData.funding_source,
      p_inventors: inventorsData 
    });

    if (error) {
        throw new Error(error.message);
    }

    return appId;
}