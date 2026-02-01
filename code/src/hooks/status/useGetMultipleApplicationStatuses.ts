import { getApplicationStatuses } from "@/services/status/get-application-statuses";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

interface PropsInterface {
    applicationIds: string[],
    isLatest?: boolean;
}

export function useGetMultipleApplicationStatuses(props: PropsInterface) {
    const queryClient = useQueryClient();

    const {applicationIds, isLatest } = props;
    const queries = useQueries(
        {
            queries: applicationIds.map((applicationId) => (
            {
                queryKey: ["latest-status", applicationId],
                queryFn: () => getApplicationStatuses({applicationId, isLatest}),
            }
            ))
        }
    )


    return { statuses: queries.map((q) => q.data), isLoading: queries.map((q) => q.isLoading), queryClient};
}