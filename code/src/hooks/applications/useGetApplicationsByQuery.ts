import { useQuery } from '@tanstack/react-query';
import { getApplicationsByQuery } from '@/services/application/get-applications-with-query';
import { CollegeUnitType } from '@/lib/types/college-units';
import { StatusType } from '@/lib/types/ip';

interface UseApplicationsGetApplicationsByQueryProps {
    title?: string;
    status?: StatusType;
    colleges?: CollegeUnitType[];
    techgens?: string[];
    ip_type?: string;
}

export function useApplicationsGetApplicationsByQuery(props: UseApplicationsGetApplicationsByQueryProps) {
    const {title, status, colleges, techgens, ip_type} = props;

    const {data, isLoading, refetch} =  useQuery({
        queryKey: ['applications'],
        queryFn: ()=> getApplicationsByQuery({title, status, colleges, techgens, ip_type}),
    });

    return {applications: data, isLoading, refetch}; 
}
