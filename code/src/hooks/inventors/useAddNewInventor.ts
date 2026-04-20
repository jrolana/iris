import { useMutation , useQueryClient} from '@tanstack/react-query';
import { addNewInventor } from '@/services/inventors/add-new-inventor';

export function useAddNewInventor() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['inventors', 'add'],
        mutationFn: addNewInventor,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['inventors']});
        }
    });

    return {inventor: data, isLoading: isPending, addNewInventor: mutateAsync}; 
}
