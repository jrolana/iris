import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInventorById } from '@/services/inventors/delete-inventor-by-id';

export function useDeleteInventor() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['inventor', 'delete'],
        mutationFn: deleteInventorById,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['inventors']});
        }
    });

    return {inventor: data, isLoading: isPending, deleteInventor:mutateAsync}; 
}
