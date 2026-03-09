import { useQuery } from '@tanstack/react-query';
import { getApplicationsByQuery } from '@/services/application/get-applications-with-query';
import { CollegeUnitType } from '@/lib/types/college-units';
import { StatusType } from '@/lib/types/ip';

interface UseApplicationsGetApplicationsByQueryProps {
    title?: string;
    statuses?: StatusType[];
    colleges?: CollegeUnitType[];
    techgens?: string[];
    ip_types?: string[];
}

export function useApplicationsGetApplicationsByQuery(props: UseApplicationsGetApplicationsByQueryProps) {
    const {title, statuses, colleges, techgens, ip_types} = props;

    const {data, isLoading, refetch, isFetching} =  useQuery({
        queryKey: ['applications'],
        queryFn: ()=> getApplicationsByQuery({title, statuses, colleges, techgens, ip_types}),
    });

    return {applications: data, isLoading: isLoading || isFetching, refetch}; 
}
