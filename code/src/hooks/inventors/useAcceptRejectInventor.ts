import { acceptRejectInventor } from '@/services/inventors/accept-reject-inventor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAcceptRejectInventor() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['inventors', 'accept-reject'],
        mutationFn: acceptRejectInventor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventors'] });
        }
    });

    return {inventor: data, isLoading: isPending, acceptRejectInventor: mutateAsync}; 
}
