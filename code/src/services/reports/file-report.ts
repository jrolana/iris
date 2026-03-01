import { supabaseClient as supabase } from "@/lib/supabase"
import { ReportType } from "@/lib/types/reports";

interface FileReportProps {
    reportData: ReportType["Insert"];
}

export const fileReport = async (props: FileReportProps) => {
    const { reportData } = props;
    const {data, error} = await supabase.schema("private").from("reports").insert(reportData).select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}