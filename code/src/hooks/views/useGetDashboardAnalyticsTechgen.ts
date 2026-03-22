import { getDashboardAnalyticsTechgen } from "@/services/views/get-dashboard-analytics-techgen";
import { useQuery } from "@tanstack/react-query";

export function useGetDashboardAnalyticsTechgen(
) {
  const { data, isPending } = useQuery({
    queryKey: ["dashboard-analytics-techgen"],
    queryFn: () => getDashboardAnalyticsTechgen(),
  });

  return { data, isLoading: isPending };
}