import { getLatestStatusById } from "@/services/status/get-latest-status";
import { useQuery } from "@tanstack/react-query";

interface PropsInterface {
    appId: string,
}

export function useGetLatestStatus(props: PropsInterface) {
    const {appId} = props;
    const { data, isPending } = useQuery(
        {
            queryKey: ["latest-status", appId],
            queryFn: () => getLatestStatusById({applicationId: appId})
        }
    )

    return { status: data, isLoading: isPending};
}