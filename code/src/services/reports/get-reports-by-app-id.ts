import { supabaseClient as supabase } from "@/lib/supabase"

interface GetReportsByAppIdProps {
    id: string;
    parentId: string | null;
}

export const getReportsByAppId = async (props: GetReportsByAppIdProps) => {
    const { id, parentId } = props;
    const searchIds = parentId ? [id, parentId] : [id];
    const {data, error} = await supabase.schema("private").from("reports").select().in("application_id", searchIds);
    if (error) {
        throw new Error(error.message);
    }

    return data;
}