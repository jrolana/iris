import { updateInventor } from '@/services/inventors/update-inventor';
import { useMutation } from '@tanstack/react-query';

export function useUpdateInventor() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['inventors', 'update'],
        mutationFn: updateInventor
    });

    return {inventor: data, isLoading: isPending, updateInventor:mutateAsync}; 
}
