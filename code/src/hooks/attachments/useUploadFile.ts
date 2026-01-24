import { useMutation, QueryClient } from '@tanstack/react-query';
import { uploadFile } from '@/services/attachments/upload-file';

export function useUploadFile() {
    const queryClient = new QueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['upload'],
        mutationFn: uploadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attachments'] });
        }
    });

    return {appId: data, isLoading: isPending, uploadFile:mutateAsync}; 
}
