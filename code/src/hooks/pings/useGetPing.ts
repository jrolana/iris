import { useQuery } from "@tanstack/react-query";
import { getPing } from "@/services/pings/get-ping";

interface PropsInterface {
    applicationId: string;
    stageDelayed: string;
    stepDelayed: string;
}

export function useGetPing(props: PropsInterface) {
    const { applicationId, stageDelayed, stepDelayed } = props;

    const {data, isLoading} = useQuery({
        queryKey: ["ping", applicationId, stageDelayed, stepDelayed],
        queryFn: () => getPing({applicationId, stageDelayed, stepDelayed}),
        enabled: !!applicationId && applicationId.trim() !== ''
    })

    return {ping: data, isLoading}
}