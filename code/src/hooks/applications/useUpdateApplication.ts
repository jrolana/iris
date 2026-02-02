import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplicationById } from '@/services/application/update-application-by-id';


export function useUpdateApplication() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['update-application'],
        mutationFn: updateApplicationById,
        onSuccess: (_, appId) => {
            queryClient.invalidateQueries({queryKey: ['application', appId]});
        }
    });

    return {application: data, isLoading: isPending, updateApp:mutateAsync}; 
}
