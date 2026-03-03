import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileReport } from '@/services/reports/file-report';

export function useFileReport() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({

        mutationKey: ['reports', 'file'],
        mutationFn: fileReport,
        onSuccess: () => {
            // Invalidate or refetch queries related to reports here if needed
             queryClient.invalidateQueries({queryKey: ['reports']});
        }
    });

    return {report: data, isLoading: isPending, fileReport: mutateAsync}; 
}
