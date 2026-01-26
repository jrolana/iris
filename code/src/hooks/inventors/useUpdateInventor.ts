import { updateInventorById } from '@/services/inventors/update-inventor-by-id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateInventor() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['inventors', 'update'],
        mutationFn: updateInventorById,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['inventors']});
        }
    });

    return {inventor: data, isLoading: isPending, updateInventor:mutateAsync}; 
}
