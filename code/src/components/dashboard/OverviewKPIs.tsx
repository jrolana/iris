"use client";

import { useMemo } from "react";
import { DashboardAnalyticsRowType } from "@/lib/types/views";

interface OverviewKpisProps {
  rawData: DashboardAnalyticsRowType[];
  yearFrom: number;
  yearTo: number;
}

type KpiItem = {
  label: string;
  value: string | number;
  helper: string;
};

export default function OverviewKPIs({
  rawData,
  yearFrom,
  yearTo,
}: OverviewKpisProps) {
  const metrics = useMemo(() => {
    const validRows = rawData.filter(
      (item) => item && item.dashboard_status !== null && item.total !== null,
    );

    const totalByStatus = (
      status: DashboardAnalyticsRowType["dashboard_status"],
    ) =>
      validRows
        .filter((item) => item.dashboard_status === status)
        .reduce((sum, item) => sum + Number(item.total ?? 0), 0);

    return {
      filed: totalByStatus("filed"),
      granted: totalByStatus("granted"),
      pending: totalByStatus("pending"),
      withdrawn: totalByStatus("withdrawn"),
      downgraded: totalByStatus("downgraded"),
    };
  }, [rawData]);

  const rangeLabel =
    yearFrom === yearTo ? `${yearFrom}` : `${yearFrom}–${yearTo}`;

  const kpis: KpiItem[] = [
    {
      label: "Total Filed",
      value: metrics.filed,
      helper: `Applications submitted in ${rangeLabel}`,
    },
    {
      label: "Total Granted",
      value: metrics.granted,
      helper: `Successful applications in ${rangeLabel}`,
    },
    {
      label: "Pending",
      value: metrics.pending,
      helper: `Applications under review in ${rangeLabel}`,
    },
    {
      label: "Withdrawn",
      value: metrics.withdrawn,
      helper: `Applications no longer pursued in ${rangeLabel}`,
    },
    {
      label: "Downgraded",
      value: metrics.downgraded,
      helper: `Applications changed to lower protection in ${rangeLabel}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {kpis.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-gray-200 bg-white p-5"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {item.value}
          </h3>
          <p className="mt-1 text-xs text-gray-500">{item.helper}</p>
        </div>
      ))}
    </div>
  );
}
