import { supabaseClient as supabase } from "@/lib/supabase";
import { GetDashboardAnalyticsParams } from "@/lib/types/views";

export const getDashboardAnalytics = async function (
  filters: GetDashboardAnalyticsParams = {},
) {
  let query = supabase
    .from("v_dashboard_analytics")
    .select()
    .order("year", { ascending: false });

  if (filters.year_from) {
    query = query.gte("year", filters.year_from);
  }

  if (filters.year_to) {
    query = query.lte("year", filters.year_to);
  }

  if (filters.dashboard_status) {
    query = query.eq("dashboard_status", filters.dashboard_status);
  }

  if (filters.ip_type) {
    query = query.eq("ip_type", filters.ip_type);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};