import { useQuery } from '@tanstack/react-query';
import { getInventorsByAppId } from '@/services/inventors/get-inventors-by-app-id';

interface UseGetInventorsByAppIdProps {
    id: string;
    parentId: string | null;
}

export function useGetInventorsByAppId(props: UseGetInventorsByAppIdProps) {
    const { id, parentId } = props;

    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['inventors', id, parentId],
        queryFn: () => getInventorsByAppId({id, parentId}),
    });

    return {inventors: data, isLoading: isLoading || isFetching}; 
}
