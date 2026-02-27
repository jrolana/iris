import { useMutation } from '@tanstack/react-query';
import { downgradeToUM } from '@/services/application/downgrade-to-um';


export function useDowngradeToUM() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['application', 'downgrade'],
        mutationFn: downgradeToUM
    });

    return {data, isDowngrading: isPending, downgradeApp:mutateAsync}; 
}
