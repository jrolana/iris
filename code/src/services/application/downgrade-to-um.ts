import { supabaseClient as supabase } from "@/lib/supabase"

import { ApplicationType } from "@/lib/types/application";
import { StatusType } from "@/lib/types/ip";

interface DowngradeToUMProps {
    applicationData: ApplicationType["Insert"];
    downgradeStatus: StatusType;
}   

export const downgradeToUM = async (props: DowngradeToUMProps) => {
    const { applicationData, downgradeStatus } = props;
    const {data: app, error} = await supabase.schema("private").from("ipr_applications").insert(
        {
            project_title: applicationData.project_title,
            ip_type: applicationData.ip_type,
            funding_source: applicationData.funding_source,
            parent_application_id: applicationData.id,
            ip_number: applicationData.ip_number,
            ip_title: applicationData.ip_title
        }
    ).select().single();

    if (error) {
        throw new Error(error.message);
    }

    if (!app) {
        throw new Error("Failed to create application");
    }

    const {data: statusId, error: statusError } = await supabase.schema("private").from("ipr_statuses").insert(
        {
            application_id: app.id,
            status_type: downgradeStatus,
        }
    ).select().single();

    if (statusError) {
        throw new Error(statusError.message);
    }

    return { app, statusId };
}