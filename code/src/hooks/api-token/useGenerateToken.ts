import { useMutation } from '@tanstack/react-query';
import { generateToken } from '@/services/api-token/generate-token';

export function useGenerateToken() {
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['api-token', 'generate'],
        mutationFn: generateToken
    });

    return {apiToken: data, isLoading: isPending, generateToken:mutateAsync}; 
}
