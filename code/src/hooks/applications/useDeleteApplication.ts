import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteApplicationById } from '@/services/application/delete-application-by-id';

export function useDeleteApplication() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['application', 'delete'],
        mutationFn: deleteApplicationById,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['applications']});
        }
    });

    return {application: data, isLoading: isPending, deleteApp:mutateAsync}; 
}
