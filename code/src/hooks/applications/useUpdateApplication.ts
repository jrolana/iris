import { useMutation } from '@tanstack/react-query';
import { updateApplication } from '@/services/application/update-application';


export function useUpdateApplication() {
    const {data, isPending, mutate} =  useMutation({
        mutationKey: ['application', 'update'],
        mutationFn: updateApplication
    });

    return {application: data, isLoading: isPending, update:mutate}; 
}
