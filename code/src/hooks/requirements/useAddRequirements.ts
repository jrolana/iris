import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addRequirements } from '@/services/requirements/add-requirements';
export function useAddRequirements() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({

        mutationKey: ['requirements', 'add'],
        mutationFn: addRequirements,
        onSuccess: () => {
            // Invalidate or refetch queries related to requirements here if needed
             queryClient.invalidateQueries({queryKey: ['requirements']});
        }
    });

    return {report: data, isLoading: isPending, addRequirements: mutateAsync}; 
}
