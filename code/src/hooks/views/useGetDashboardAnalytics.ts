import { getDashboardAnalytics } from "@/services/views/get-dashboard-analytics";
import { useQuery } from "@tanstack/react-query";
import { GetDashboardAnalyticsParams } from "@/lib/types/views";

export function useGetDashboardAnalytics(
  filters: GetDashboardAnalyticsParams = {},
) {
  const { data, isPending } = useQuery({
    queryKey: ["dashboard-analytics", filters],
    queryFn: () => getDashboardAnalytics(filters),
  });

  return { data, isLoading: isPending };
}