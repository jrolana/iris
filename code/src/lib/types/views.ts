import { Database } from "./supabase";

export type DashboardAnalyticsType =  Database["public"]["Views"]["v_dashboard_analytics"]["Row"];
export type DashboardAnalyticsTechgenType = Database["public"]["Views"]["v_dashboard_analytics_techgen"]["Row"];

export type GetDashboardAnalyticsParams = {
  year_from?: number;
  year_to?: number;
  dashboard_status?: DashboardAnalyticsType["dashboard_status"];
  ip_type?: DashboardAnalyticsType["ip_type"];
};