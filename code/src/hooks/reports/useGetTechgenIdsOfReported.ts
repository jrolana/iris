import { useQuery } from '@tanstack/react-query';
import { getTechgenIdsOfReported } from '@/services/reports/get-techgen-ids-of-reported';

interface UseGetTechgenIdsOfReportedProps {
    id: string;
    parentId: string | null;
    reporterId: string;
}

export function useGetTechgenIdsOfReported(props: UseGetTechgenIdsOfReportedProps) {
    const { id, parentId, reporterId } = props;

    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['reports', id, parentId, reporterId],
        queryFn: () => getTechgenIdsOfReported({id, parentId, reporterId}),
    
    });

    return {reportedTechgenIds: data, isLoading: isLoading || isFetching}; 
}
