import { useQuery } from '@tanstack/react-query';
import { getReportsByAppId } from '@/services/reports/get-reports-by-app-id';

interface UseGetReportsByAppIdProps {
    id: string;
    parentId: string | null;
}

export function useGetReportsByAppId(props: UseGetReportsByAppIdProps) {
    const { id, parentId } = props;

    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['reports', id, parentId],
        queryFn: () => getReportsByAppId({id, parentId}),
        
    });

    return {reports: data, isLoading: isLoading || isFetching}; 
}
