import { useMutation } from '@tanstack/react-query';
import { generateUrlByStoragePath } from '@/services/attachments/generate-url-by-storage-path';

export function useGetUrlByStoragePath() {

    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ["generate-url-by-storage-path"],
        mutationFn: generateUrlByStoragePath,
    });

    return {url: data, isLoading: isPending, fetchUrl: mutateAsync}; 
}
