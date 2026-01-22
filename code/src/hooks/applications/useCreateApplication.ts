import { useMutation } from '@tanstack/react-query';
import { createApplication } from '@/services/application/create-application';

export function useCreateApplication() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['application', 'create'],
        mutationFn: createApplication
    });

    return {application: data, isLoading: isPending, create:mutateAsync}; 
}
