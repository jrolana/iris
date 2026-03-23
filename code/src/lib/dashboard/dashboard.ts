
import { DashboardAnalyticsType } from "../types/views";

export const PIE_CHARTS: {
  chartId: string;
  title: string;
  status: NonNullable<DashboardAnalyticsType["dashboard_status"]>;
}[] = [
  {
    chartId: "dashboard-filed-pie",
    title: "Filed Applications",
    status: "filed",
  },
  {
    chartId: "dashboard-granted-pie",
    title: "Granted Applications",
    status: "granted",
  },
  {
    chartId: "dashboard-pending-pie",
    title: "Pending Applications",
    status: "pending",
  },
  {
    chartId: "dashboard-withdrawn-pie",
    title: "Withdrawn Applications",
    status: "withdrawn",
  },
  {
    chartId: "dashboard-downgraded-pie",
    title: "Downgraded Applications",
    status: "downgraded",
  },
];

export const TREND_CHARTS: {
  chartId: string;
  title: string;
  status: NonNullable<DashboardAnalyticsType["dashboard_status"]>;
  colSpan?: string;
}[] = [
  {
    chartId: "dashboard-filed-combo",
    title: "Filed Applications Over Time",
    status: "filed",
    colSpan: "lg:col-span-6",
  },
  {
    chartId: "dashboard-pending-combo",
    title: "Pending Applications Over Time",
    status: "pending",
    colSpan: "lg:col-span-6",
  },
  {
    chartId: "dashboard-granted-combo",
    title: "Granted Applications Over Time",
    status: "granted",
    colSpan: "lg:col-span-12",
  },
  {
    chartId: "dashboard-withdrawn-combo",
    title: "Withdrawn Applications Over Time",
    status: "withdrawn",
    colSpan: "lg:col-span-6",
  },
  {
    chartId: "dashboard-downgraded-combo",
    title: "Downgraded Applications Over Time",
    status: "downgraded",
    colSpan: "lg:col-span-6",
  },
];

export const PDF_EXPORT_CHARTS = [
  { chartId: "dashboard-grant-rate-donut", title: "Grant Rate" },
  { chartId: "dashboard-filed-pie", title: "Filed Applications" },
  { chartId: "dashboard-granted-pie", title: "Granted Applications" },
  { chartId: "dashboard-pending-pie", title: "Pending Applications" },
  { chartId: "dashboard-withdrawn-pie", title: "Withdrawn Applications" },
  { chartId: "dashboard-downgraded-pie", title: "Downgraded Applications" },
  { chartId: "dashboard-filed-combo", title: "Filed Applications Over Time" },
  {
    chartId: "dashboard-pending-combo",
    title: "Pending Applications Over Time",
  },
  {
    chartId: "dashboard-granted-combo",
    title: "Granted Applications Over Time",
  },
  {
    chartId: "dashboard-withdrawn-combo",
    title: "Withdrawn Applications Over Time",
  },
  {
    chartId: "dashboard-downgraded-combo",
    title: "Downgraded Applications Over Time",
  },
];