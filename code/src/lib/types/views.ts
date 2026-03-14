import { Database } from "./supabase";

export type DashboardAnalyticsType = Database["public"]["Views"]["v_dashboard_analytics"];
export type DashboardAnalyticsRowType = DashboardAnalyticsType["Row"];

export type GetDashboardAnalyticsParams = {
  year_from?: number;
  year_to?: number;
  dashboard_status?: DashboardAnalyticsRowType["dashboard_status"];
  ip_type?: DashboardAnalyticsRowType["ip_type"];
};