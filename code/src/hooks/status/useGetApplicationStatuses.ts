import { getApplicationStatuses } from "@/services/status/get-application-statuses";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PropsInterface {
    applicationId: string,
    isLatest?: boolean;
}

export function useGetApplicationStatuses(props: PropsInterface) {
    const queryClient = useQueryClient();

    const {applicationId, isLatest } = props;
    const { data, isLoading } = useQuery(
        {
            queryKey: ["latest-status", applicationId],
            queryFn: () => getApplicationStatuses({applicationId, isLatest}),
        }
    )

    return { statuses: data, isLoading, queryClient};
}