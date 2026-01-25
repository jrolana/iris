import { useMutation } from '@tanstack/react-query';
import { deleteApplicationById } from '@/services/application/delete-application-by-id';

export function useDeleteApplication() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['application', 'delete'],
        mutationFn: deleteApplicationById
    });

    return {application: data, isLoading: isPending, deleteApp:mutateAsync}; 
}
