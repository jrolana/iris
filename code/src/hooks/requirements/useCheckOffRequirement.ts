import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkOffRequirement } from '@/services/requirements/check-off-requirement';

export function useCheckOffRequirement() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({

        mutationKey: ['requirements', 'check-off'],
        mutationFn: checkOffRequirement,
        onSuccess: () => {
            // Invalidate or refetch queries related to requirements here if needed
             queryClient.invalidateQueries({queryKey: ['requirements']});
        }
    });

    return {report: data, isLoading: isPending, checkOffRequirement: mutateAsync}; 
}
