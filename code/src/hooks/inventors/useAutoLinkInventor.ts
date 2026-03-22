import { autolinkInventors } from "../../services/inventors/autolink-inventors";
import { useMutation, useQueryClient } from '@tanstack/react-query';


export function useAutoLinkInventor() {
    const queryClient = useQueryClient();
    const { mutateAsync, data, isPending } = useMutation({
        mutationFn: autolinkInventors,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['inventors']});
        }
    });

    return {linkedInventorData: data, isLoading: isPending, autoLinkInventor: mutateAsync}; 
}
