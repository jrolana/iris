import { useMutation } from '@tanstack/react-query';
import { fileReport } from '@/services/reports/file-report';

export function useFileReport() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['reports', 'file'],
        mutationFn: fileReport
    });

    return {report: data, isLoading: isPending, fileReport: mutateAsync}; 
}
