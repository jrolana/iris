import { useQuery } from '@tanstack/react-query';
import { getApplications } from '@/services/application/get-applications';

export function useApplications() {

    const {data, isLoading} =  useQuery({
        queryKey: ['applications'],
        queryFn: getApplications,
    });

    return {application: data, isLoading}; 
}
