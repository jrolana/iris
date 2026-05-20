import { useQuery } from '@tanstack/react-query';
import { getReportsByAppId } from '@/services/reports/get-reports-by-app-id';

interface UseGetApplicationRequirementsProps {
    applicationId: string;
}

export function useGetApplicationRequirements(props: UseGetApplicationRequirementsProps) {
    const { applicationId } = props;

    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['reports', applicationId],
        queryFn: () => getReportsByAppId({id: applicationId, parentId: null}),
    });

    return {reports: data, isLoading: isLoading || isFetching}; 
}
