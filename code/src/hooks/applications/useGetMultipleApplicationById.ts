import { useQueries, useQuery } from '@tanstack/react-query';
import { getApplicationById } from '@/services/application/get-application-by-id';


interface UseGetApplicationByIdProp {
  applicationIds: string[];
}

export function useGetMultipleAppById(props: UseGetApplicationByIdProp) {
    const { applicationIds } = props;

    const query =  useQueries(
        {
            queries: applicationIds.map((applicationId) => (
            {
                queryKey: ['application', applicationId],
                queryFn: () => getApplicationById({id: applicationId}),
            }
            ))
        }
    );

    return {applications: query.map((q) => q.data), isLoading: query.map((q) => q.isLoading)}; 
}
