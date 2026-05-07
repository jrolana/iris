import { useQuery } from "@tanstack/react-query";

import { getAuditTrail } from "@/services/audit-trail/get-audit-trail";

export function useGetAuditTrail() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["audit-trail"],
    queryFn: getAuditTrail,
  });

  return {
    data: data ?? [],
    isLoading,
    isFetching,
  };
}
