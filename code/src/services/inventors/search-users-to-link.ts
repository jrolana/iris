import { supabaseClient as supabase } from "@/lib/supabase";

export interface SearchUsersToLinkResult {
  id: string;
  full_name: string;
  email: string;
  college_code: string | null;
  external_institution: string | null;
  other_college_name: string | null;
}

interface SearchUsersToLinkProps {
  queryString: string;
  excludedUserIds: string[];
}

export const searchUsersToLink = async (
  props: SearchUsersToLinkProps,
): Promise<SearchUsersToLinkResult[]> => {
  const { queryString, excludedUserIds } = props;
  const safeExcludedIds = excludedUserIds || [];

  const { data, error } = await supabase.rpc("search_users_for_linking", {
    search_query: queryString,
    excluded_ids: safeExcludedIds,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SearchUsersToLinkResult[];
};