import { useQuery } from '@tanstack/react-query';
import { getInventorIdsOfReported } from '@/services/reports/get-inventor-ids-of-reported';

interface UseGetInventorIdsOfReportedProps {
    id: string;
    parentId: string | null;
    reporterId: string;
}

export function useGetInventorIdsOfReported(props: UseGetInventorIdsOfReportedProps) {
    const { id, parentId, reporterId } = props;

    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['reports', id, parentId, reporterId],
        queryFn: () => getInventorIdsOfReported({id, parentId, reporterId}),
        enabled: Boolean(reporterId),
    });

    return {reportedInventorIds: data, isLoading: isLoading || isFetching}; 
}
