import { getApplicationStatuses } from "@/services/status/get-application-statuses";
import { useQueries } from "@tanstack/react-query";

interface PropsInterface {
    applicationIds: string[],
    isLatest?: boolean;
}

export function useGetMultipleApplicationStatuses(props: PropsInterface) {
    const {applicationIds, isLatest } = props;
    const validApplicationIds = applicationIds.filter(id => id!=null && id!="");

    const queries = useQueries(
        {
            queries: validApplicationIds.map((applicationId) => (
            {
                queryKey: ["multiple-status", applicationId, isLatest],
                queryFn: () => getApplicationStatuses({applicationId, isLatest}),
            }
            ))
        }
    )

    return { statuses: queries.map((q) => q.data), isLoading: queries.map((q) => q.isLoading)};
}