import { useMutation } from '@tanstack/react-query';
import { addNewInventor } from '@/services/inventors/add-new-inventor';

export function useAddNewInventor() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['inventors', 'add'],
        mutationFn: addNewInventor
    });

    return {inventor: data, isLoading: isPending, addNewInventor: mutateAsync}; 
}
