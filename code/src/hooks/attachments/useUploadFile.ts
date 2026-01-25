import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile } from '@/services/attachments/upload-file';

export function useUploadFile() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['upload'],
        mutationFn: uploadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        }
    });

    return {appId: data, isLoading: isPending, uploadFile:mutateAsync}; 
}
