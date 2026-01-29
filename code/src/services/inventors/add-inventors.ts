import { supabaseClient as supabase } from "@/lib/supabase"
import { InventorType } from "@/lib/types/application";

interface AddInventorsProps {
    inventorsData: InventorType["Insert"][];
}

export const addInventors = async (props: AddInventorsProps) => {
    const { inventorsData } = props;
    const {data, error} = await supabase.schema("private").from("inventors").insert(inventorsData).select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}