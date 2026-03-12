import { Database } from "./supabase";

export type DashboardAnalyticsType = Database["public"]["Views"]["v_dashboard_analytics"];

export type GetDashboardAnalyticsParams = {
  year_from?: number;
  year_to?: number;
  dashboard_status?: DashboardAnalyticsType["Row"]["dashboard_status"];
  ip_type?: DashboardAnalyticsType["Row"]["ip_type"];
};