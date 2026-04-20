import { supabaseClient as supabase } from "@/lib/supabase"

interface GetInventorsByAppIdProps {
    id: string;
    parentId: string | null;
}

export const getInventorsByAppId = async (props: GetInventorsByAppIdProps) => {
    const { id, parentId } = props;
    const searchIds = parentId ? [id, parentId] : [id];
    const {data, error} = await supabase.schema("private").from("inventors").select().in("application_id", searchIds);

    if (error) {
        throw new Error(error.message);
    }

    if(data){
        const sortedData = data.toSorted((a, b) => {
            const statusOrder = ["member", "pending", "non-member"];
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });
        return sortedData;
    }

    return data;
}