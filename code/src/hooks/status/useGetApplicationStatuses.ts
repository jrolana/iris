import { getApplicationStatuses } from "@/services/status/get-application-statuses";
import { useQuery } from "@tanstack/react-query";

interface PropsInterface {
    applicationId: string,
    isLatest?: boolean;
}

export function useGetApplicationStatuses(props: PropsInterface) {
    const {applicationId, isLatest = false } = props;
    const { data, isLoading } = useQuery(
        {
            queryKey: ["latest-status", applicationId, isLatest],
            queryFn: () => getApplicationStatuses({applicationId, isLatest}),
            enabled: !!applicationId && applicationId.trim() !== ''
        }
    )

    return { statuses: data, isLoading};
}