import { acceptRejectInventor } from '@/services/inventors/accept-reject-inventor';
import { useMutation } from '@tanstack/react-query';

export function useAcceptRejectInventor() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['inventors', 'accept-reject'],
        mutationFn: acceptRejectInventor
    });

    return {inventor: data, isLoading: isPending, acceptRejectInventor: mutateAsync}; 
}
