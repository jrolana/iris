import { useQuery } from '@tanstack/react-query';
import { getInventorsByAppId } from '@/services/inventors/get-inventors-by-app-id';

interface UseGetInventorsByAppIdProps {
    id: string;
}

export function useGetInventorsByAppId(props: UseGetInventorsByAppIdProps) {
    const { id } = props;

    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['inventors', id],
        queryFn: () => getInventorsByAppId({id}),
    });

    return {inventors: data, isLoading: isLoading || isFetching}; 
}
