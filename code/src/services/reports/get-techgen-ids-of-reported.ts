import { supabaseClient as supabase } from "@/lib/supabase"

interface GetTechgenIdsOfReportedProps {
    id: string;
    parentId: string | null;
    reporterId: string;
}

export const getTechgenIdsOfReported = async (props: GetTechgenIdsOfReportedProps) => {
    const { id, parentId, reporterId } = props;
    const searchIds = parentId ? [id, parentId] : [id];
    const {data, error} = await supabase.schema("private").from("reports").select("subject_id").in("application_id", searchIds).eq("reporter_id", reporterId);
    
    if (error) {
        throw new Error(error.message);
    }

    const flattenedData = data.map(item => item.subject_id);

    return flattenedData;
}