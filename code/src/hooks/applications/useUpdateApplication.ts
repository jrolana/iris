import { useMutation } from '@tanstack/react-query';
import { updateApplicationById } from '@/services/application/update-application-by-id';


export function useUpdateApplication() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['application', 'update'],
        mutationFn: updateApplicationById
    });

    return {application: data, isLoading: isPending, updateApp:mutateAsync}; 
}
