import {
  searchUsersToLink,
  SearchUsersToLinkResult,
} from "@/services/inventors/search-users-to-link";
import { useQuery } from "@tanstack/react-query";

interface UseSearchUsersToLink {
  queryString: string;
  excludedUserIds: string[];
  enabled?: boolean;
}

export function useSearchUsersToLink(props: UseSearchUsersToLink) {
  const { queryString, excludedUserIds, enabled = true } = props;

  const { data, isLoading, isFetching, refetch } = useQuery<
    SearchUsersToLinkResult[]
  >({
    queryKey: ["users", queryString, excludedUserIds],
    queryFn: () => searchUsersToLink({ queryString, excludedUserIds }),
    enabled,
    placeholderData: (prev) => prev,
  });

  return {
    inventors: data ?? [],
    isLoading,
    isFetching,
    refetch,
  };
}
