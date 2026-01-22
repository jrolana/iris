import { useMutation } from '@tanstack/react-query';
import { deleteApplication } from '@/services/application/delete-application';

export function useDeleteApplication() {
    const {data, isPending, mutate} =  useMutation({
        mutationKey: ['application', 'delete'],
        mutationFn: deleteApplication
    });

    return {application: data, isLoading: isPending, delete:mutate}; 
}
