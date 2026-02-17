import { supabaseClient as supabase } from "@/lib/supabase"
import { InventorType } from "@/lib/types/application";

interface UpdateInventorProps {
    id: string;
    inventorData: Partial<InventorType["Update"]>;
}

export const updateInventorById = async (props: UpdateInventorProps) => {
    const { id, inventorData } = props;
    const { data, error } = await supabase.schema("private").from('inventors').update(inventorData).eq('id', id).select().maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("Inventor not found.");
    }

    return data;
}