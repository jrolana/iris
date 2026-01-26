import { useMutation } from '@tanstack/react-query';
import { updateApplication } from '@/services/application/update-application';


export function useUpdateApplication() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['application', 'update'],
        mutationFn: updateApplication
    });

    return {application: data, isLoading: isPending, updateApp:mutateAsync}; 
}
