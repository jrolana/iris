import { searchUsersToLink } from '@/services/inventors/search-users-to-link';
import { useQuery } from '@tanstack/react-query';

interface UseSearchUsersToLink {
    queryString: string;
    excludedUserIds: string[];
}

export function useSearchUsersToLink(props: UseSearchUsersToLink) {
    const { queryString, excludedUserIds } = props;
    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['users', queryString, excludedUserIds],
        queryFn: () => searchUsersToLink( { queryString,  excludedUserIds} ),
        enabled: queryString.length > 0,
        placeholderData: (prev) => prev,
    });

    return {inventors: data, isLoading, isFetching}; 
}
