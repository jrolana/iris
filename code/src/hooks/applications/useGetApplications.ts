import { useQuery } from '@tanstack/react-query';
import { getApplicationsByQuery } from '@/services/application/get-applications-with-query';
import { CollegeUnitType } from '@/lib/types/college-units';
import { StatusType } from '@/lib/types/ip';

interface UseApplicationsGetApplicationsByQueryProps {
    title?: string;
    status?: StatusType;
    colleges?: CollegeUnitType[];
    techgens?: string[];
}

export function useApplicationsGetApplicationsByQuery(props: UseApplicationsGetApplicationsByQueryProps) {
    const {title, status, colleges, techgens} = props;

    const {data, isLoading} =  useQuery({
        queryKey: ['applications'],
        queryFn: ()=> getApplicationsByQuery({title, status, colleges, techgens}),
    });

    return {application: data, isLoading}; 
}
