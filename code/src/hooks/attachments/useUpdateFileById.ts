import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFileById } from '@/services/attachments/update-file-by-id';

export function useUpdateFileById() {
    const queryClient = useQueryClient();
    const {data, isPending, mutateAsync} =  useMutation({
        mutationKey: ['file', 'update'],
        mutationFn: updateFileById,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["files"]});
        }
    });

    return {file: data, isLoading: isPending, updateFile:mutateAsync}; 
}
