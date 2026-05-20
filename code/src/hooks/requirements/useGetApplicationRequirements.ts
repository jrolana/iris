import { useQuery } from '@tanstack/react-query';
import { getApplicationRequirements } from '@/services/requirements/get-application-requirements';

interface UseGetApplicationRequirementsProps {
    applicationId: string;
}

export function useGetApplicationRequirements(props: UseGetApplicationRequirementsProps) {
    const { applicationId } = props;

    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['requirements', applicationId],
        queryFn: () => getApplicationRequirements({applicationId: applicationId}),
    });

    return {requirements: data, isLoading: isLoading || isFetching}; 
}
