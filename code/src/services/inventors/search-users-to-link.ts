import { supabaseClient as supabase } from "@/lib/supabase"

interface SearchUsersToLinkProps {
    queryString: string;
    excludedUserIds: string[]
}

export const searchUsersToLink = async (props: SearchUsersToLinkProps) => {
    const { queryString, excludedUserIds } = props;
    const safeExcludedIds = excludedUserIds || [];
    const { data, error } = await supabase.rpc('search_users_for_linking', {search_query: queryString, excluded_ids: safeExcludedIds});

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}