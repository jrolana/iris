import { supabaseClient as supabase } from "@/lib/supabase"
import { InventorType } from "@/lib/types/application";

interface UpdateInventorProps {
    id: string;
    inventorData: Partial<InventorType["Update"]>;
}

export const updateInventor = async (props: UpdateInventorProps) => {
    const { id, inventorData } = props;
    const { data, error } = await supabase.schema("private").from('inventors').update(inventorData).eq('id', id).select()

    if (error) {
        throw new Error(error.message);
    }

    return data;
}