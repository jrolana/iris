import { useQuery } from "@tanstack/react-query";
import { getPing } from "@/services/pings/get-ping";

interface PropsInterface {
    applicationId: string;
}

export function useGetPing(props: PropsInterface) {
    const { applicationId } = props;

    const {data, isLoading} = useQuery({
        queryKey: ["get-ping", applicationId],
        queryFn: () => getPing({applicationId}),
        enabled: !!applicationId && applicationId.trim() !== ''
    })

    return {ping: data, isLoading}
}