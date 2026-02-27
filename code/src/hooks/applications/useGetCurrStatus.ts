import { useQuery } from '@tanstack/react-query';
import { getCurrStatus } from '@/services/application/get-curr-status';


interface UseGetCurrStatusProps {
  statusId: string | null;
}

export function useGetCurrStatus(props: UseGetCurrStatusProps) {
    const { statusId } = props;

    const {data, isLoading, isFetched} =  useQuery({
        queryKey: ['status', statusId],
        queryFn: () => getCurrStatus({id: statusId}),
        enabled: !!statusId && statusId.trim() !== ''
    });

    return {status: data, isLoading, isFetched}; 
}
