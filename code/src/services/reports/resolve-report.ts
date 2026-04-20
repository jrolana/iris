import { supabaseClient as supabase } from "@/lib/supabase"

interface ResolveReportProps {
    reportId: string;
}

export const resolveReport = async (props: ResolveReportProps) => {
    const { reportId } = props;
    const { data, error } = await supabase.schema("private").from("reports").update({ is_resolved: true }).eq("id", reportId).select();

    if (error) {
        throw new Error(error.message);
    }


    return data;
};