import { useQuery } from '@tanstack/react-query';
import { getFilesByAppId } from '@/services/attachments/get-files-by-app-id';

interface UseGetFilesByAppIdProps {
    id: string;
}

export function useGetFilesByAppId(props: UseGetFilesByAppIdProps) {
    const { id } = props;

    const {data, isLoading, isFetching} =  useQuery({
        queryKey: ['files', id],
        queryFn: () => getFilesByAppId({id}),
    });

    return {files: data, isLoading: isLoading || isFetching}; 
}
