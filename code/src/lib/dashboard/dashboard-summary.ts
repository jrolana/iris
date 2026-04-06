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
  const ipTypesFromData = Array.from(
    new Set(filteredData.map((item) => item.ip_type).filter(Boolean)),
  ) as string[];

  const orderedIpTypes = [
    ...IP_TYPES.filter((ipType) => ipTypesFromData.includes(ipType)),
    ...ipTypesFromData.filter(
      (ipType) =>
        !IP_TYPES.includes(ipType as (typeof IP_TYPES)[number]),
    ),
  ];

  return orderedIpTypes.map((ipType) => {
    const row: Omit<SummaryTableRow, "total"> = {
      ipType,
      filed: 0,
      pending: 0,
      granted: 0,
      withdrawn: 0,
      downgraded: 0,
    };

    filteredData.forEach((item) => {
      if (item.ip_type !== ipType) return;
      if (
        !STATUS_ORDER.includes(item.dashboard_status as DashboardStatus)
      ) {
        return;
      }

      const status = item.dashboard_status as DashboardStatus;
      row[status] += Number(item.total ?? 0);
    });

    return {
      ...row,
      total:
        row.filed +
        row.pending +
        row.granted +
        row.withdrawn +
        row.downgraded,
    };
  });
};

export const buildSummaryTotals = (
  rows: SummaryTableRow[],
): SummaryTotals => {
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