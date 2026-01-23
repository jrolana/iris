import { useMutation } from '@tanstack/react-query';
import { addInventors } from '@/services/inventors/add-inventors';

export function useAddInventors() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['inventors', 'add'],
        mutationFn: addInventors
    });

    return {inventors: data, isLoading: isPending, addInventors:mutateAsync}; 
}
