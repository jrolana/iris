import { supabaseClient as supabase } from "@/lib/supabase"
import { ReportType } from "@/lib/types/reports";
import { assertApplicationActionAllowed } from "../application/assert-application-action-allowed";

interface FileReportProps {
    reportData: ReportType["Insert"];
}

export const fileReport = async (props: FileReportProps) => {
    const { reportData } = props;
    await assertApplicationActionAllowed(reportData.application_id, {
        downgradedMessage:
            "Reports can no longer be filed because this application has already been downgraded to a Utility Model.",
        withdrawnMessage:
            "Reports can no longer be filed because this application has been withdrawn.",
    });

    const {data, error} = await supabase.schema("private").from("reports").insert(reportData).select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
