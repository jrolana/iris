import { supabaseClient as supabase } from "@/lib/supabase"
import { assertApplicationActionAllowed } from "../application/assert-application-action-allowed";

interface ResolveReportProps {
    reportId: string;
}

export const resolveReport = async (props: ResolveReportProps) => {
    const { reportId } = props;
    const { data: report, error: reportError } = await supabase
        .schema("private")
        .from("reports")
        .select("application_id")
        .eq("id", reportId)
        .maybeSingle();

    if (reportError) {
        throw new Error(reportError.message);
    }

    if (!report) {
        throw new Error("Report not found.");
    }

    await assertApplicationActionAllowed(report.application_id, {
        downgradedMessage:
            "Reports can no longer be resolved because this application has already been downgraded to a Utility Model.",
        withdrawnMessage:
            "Reports can no longer be resolved because this application has been withdrawn.",
    });

    const { data, error } = await supabase.schema("private").from("reports").update({ is_resolved: true }).eq("id", reportId).select();

    if (error) {
        throw new Error(error.message);
    }


    return data;
};
