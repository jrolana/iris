import { supabaseClient as supabase } from "@/lib/supabase"

interface GetReportsByAppInventorIdProps {
    id: string;
    subjectId: string;
    parentId: string | null;
}

export const getReportsByAppInventorId = async (props: GetReportsByAppInventorIdProps) => {
    const { id, subjectId, parentId } = props;
    const searchIds = parentId ? [id, parentId] : [id];
    const {data, error} = await supabase.schema("private").from("reports").select("*, reporter:inventors!reporter_id ( techgen_id ), app:ipr_applications!application_id ( project_title )").in("application_id", searchIds).eq("subject_id", subjectId);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}