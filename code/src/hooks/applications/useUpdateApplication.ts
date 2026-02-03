import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplicationById } from '@/services/application/update-application-by-id';

// added so that the app gets refetched once the app gets updated
interface PropsInterface {
    appId: string;
}

export function useUpdateApplication(props: PropsInterface) {
    const { appId } = props;

    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['update-application'],
        mutationFn: updateApplicationById,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['application', appId]});
            queryClient.invalidateQueries({queryKey: ['notifications']});
        }
    });

    return {application: data, isLoading: isPending, updateApp:mutateAsync}; 
}
