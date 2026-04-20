import { DashboardAnalyticsType } from "@/lib/types/views";
import { ipTypeToTitle } from "../helper/get-ip-title";
import { IP_TYPES } from "../types/ip";

export const STATUS_ORDER = [
  "filed",
  "pending",
  "granted",
  "withdrawn",
  "downgraded",
] as const;

export type DashboardStatus = (typeof STATUS_ORDER)[number];

export const DASHBOARD_STATUS_LABELS: Record<DashboardStatus, string> = {
  filed: "Filed",
  pending: "Pending",
  granted: "Granted",
  withdrawn: "Withdrawn",
  downgraded: "Downgraded",
};

export type SummaryTableRow = {
  year: number;
  ipType: string;
  filed: number;
  pending: number;
  granted: number;
  withdrawn: number;
  downgraded: number;
  total: number;
};

export type SummaryTotals = {
  filed: number;
  pending: number;
  granted: number;
  withdrawn: number;
  downgraded: number;
  total: number;
};

export const formatIpTypeLabel = (ipType: string) => {
  return (
    ipTypeToTitle(ipType) ??
    ipType
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
};

export const buildSummaryTableRows = (
  filteredData: DashboardAnalyticsType[],
): SummaryTableRow[] => {
  const groupedRows = new Map<string, Omit<SummaryTableRow, "total">>();

  filteredData.forEach((item) => {
    if (!item.ip_type || item.year === null) return;
    if (!STATUS_ORDER.includes(item.dashboard_status as DashboardStatus)) {
      return;
    }

    const year = Number(item.year);
    const key = `${year}:${item.ip_type}`;

    if (!groupedRows.has(key)) {
      groupedRows.set(key, {
        year,
        ipType: item.ip_type,
        filed: 0,
        pending: 0,
        granted: 0,
        withdrawn: 0,
        downgraded: 0,
      });
    }

    const row = groupedRows.get(key)!;
    const status = item.dashboard_status as DashboardStatus;
    row[status] += Number(item.total ?? 0);
  });

  return Array.from(groupedRows.values())
    .map((row) => ({
      ...row,
      total:
        row.filed + row.pending + row.granted + row.withdrawn + row.downgraded,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;

      const aIndex = IP_TYPES.indexOf(a.ipType as (typeof IP_TYPES)[number]);
      const bIndex = IP_TYPES.indexOf(b.ipType as (typeof IP_TYPES)[number]);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return a.ipType.localeCompare(b.ipType);
    });
};

export const buildSummaryTotals = (rows: SummaryTableRow[]): SummaryTotals => {
  return rows.reduce(
    (acc, row) => {
      acc.filed += row.filed;
      acc.pending += row.pending;
      acc.granted += row.granted;
      acc.withdrawn += row.withdrawn;
      acc.downgraded += row.downgraded;
      acc.total += row.total;
      return acc;
    },
    {
      filed: 0,
      pending: 0,
      granted: 0,
      withdrawn: 0,
      downgraded: 0,
      total: 0,
    },
  );
};
