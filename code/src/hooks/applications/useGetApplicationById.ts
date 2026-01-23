import { useQuery } from '@tanstack/react-query';
import { getApplicationById } from '@/services/application/get-application-by-id';


interface UseGetApplicationByIdProp {
  appId: string;
}

export function useGetAppById(props: UseGetApplicationByIdProp) {
    const { appId } = props;

    const {data, isLoading} =  useQuery({
        queryKey: ['application', appId],
        queryFn: () => getApplicationById({id: appId}),
    });

    return {application: data, isLoading}; 
}
