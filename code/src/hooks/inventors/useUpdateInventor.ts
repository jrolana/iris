import { updateInventor } from '@/services/inventors/update-inventor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateInventor() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['inventors', 'update'],
        mutationFn: updateInventor,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['inventors']});
        }
    });

    return {inventor: data, isLoading: isPending, updateInventor:mutateAsync}; 
}
