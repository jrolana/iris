import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplicationById } from '@/services/application/update-application-by-id';


export function useUpdateApplication() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['application', 'update'],
        mutationFn: updateApplicationById,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['applications', "application", data.id]});
        }
    });

    return {application: data, isLoading: isPending, updateApp:mutateAsync}; 
}
