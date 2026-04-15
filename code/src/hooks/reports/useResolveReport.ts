import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveReport } from '@/services/reports/resolve-report';


export function useResolveReport() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['reports', 'resolve'],
        mutationFn: resolveReport,
        onSuccess: () => {
            // Invalidate or refetch queries related to reports here if needed
             queryClient.invalidateQueries({queryKey: ['reports']});
        }
    });

    return {report: data, isLoading: isPending, resolveReport: mutateAsync}; 
}
