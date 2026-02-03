import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFileById } from '@/services/attachments/delete-file-by-id';

export function useDeleteFileById() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['files', 'delete'],
        mutationFn: deleteFileById,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['files']});
            queryClient.invalidateQueries({queryKey: ['notifications']});
        }
    });

    return {file: data, isLoading: isPending, deleteFile:mutateAsync}; 
}
