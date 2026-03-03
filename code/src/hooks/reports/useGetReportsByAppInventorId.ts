import { useQuery } from '@tanstack/react-query';
import { getReportsByAppInventorId } from '@/services/reports/get-reports-by-app-inventor-id';

interface UseGetReportsByAppInventorIdProps {
    id: string;
    subjectId: string;
    parentId: string | null;
}

export function useGetReportsByAppInventorId(props: UseGetReportsByAppInventorIdProps) {
    const { id, parentId, subjectId } = props;

    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['reports', id, parentId, subjectId],
        queryFn: () => getReportsByAppInventorId({id, parentId, subjectId}),
    });

    return {reports: data, isLoading: isLoading || isFetching}; 
}
