import { supabaseClient as supabase } from "@/lib/supabase"
import { InventorType } from "@/lib/types/application";

interface AddNewInventorProps {
    inventorData: InventorType["Insert"];
}

export const addNewInventor = async (props: AddNewInventorProps) => {
    const { inventorData } = props;
    const {data, error} = await supabase.schema("private").from("inventors").insert(inventorData).select();

    if (error) {
        alert(error.message);
        throw new Error(error.message);
    }

    return data;
}