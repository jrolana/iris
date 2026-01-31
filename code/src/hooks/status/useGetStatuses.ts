import { getApplicationStatuses } from "@/services/status/get-application-statuses";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PropsInterface {
    applicationId: string,
    isLatest?: boolean;
}

export function useGetApplicationStatuses(props: PropsInterface) {
    const queryClient = useQueryClient();

    queryClient.invalidateQueries({queryKey: ["latest-status"]});

    const {applicationId, isLatest } = props;
    const { data, isPending } = useQuery(
        {
            queryKey: ["latest-status", applicationId],
            queryFn: () => getApplicationStatuses({applicationId, isLatest}),
        }
    )

    return { statuses: data, isLoading: isPending};
}