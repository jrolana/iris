import { supabaseClient as supabase } from "@/lib/supabase"

interface SearchInventorProps {
    queryString: string;
}

export const searchInventor = async (props: SearchInventorProps) => {
    const { queryString } = props;
    const { data, error } = await supabase.schema("private").from('inventors').select().ilike('name', `%${queryString}%`);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}