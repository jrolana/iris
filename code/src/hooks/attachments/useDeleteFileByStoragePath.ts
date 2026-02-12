import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFileByStoragePath } from '@/services/attachments/delete-file-by-storage-path';

export function useDeleteFileByStoragePath() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['files', 'delete'],
        mutationFn: deleteFileByStoragePath,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['files']});
            queryClient.invalidateQueries({queryKey: ['notifications']});
        }
    });

    return {file: data, isLoading: isPending, deleteFile:mutateAsync}; 
}
