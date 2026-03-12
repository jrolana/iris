"use client";

import { COLORS } from "@/lib/constants/ui";
import { DashboardAnalyticsType } from "@/lib/types/views";
import { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { PieChartIcon } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PropsInterface {
  title: string;
  subtitle: string;
  showLegend?: boolean;
  colors?: string[];
  rawData: DashboardAnalyticsType["Row"][];
  dashboardStatus: DashboardAnalyticsType["Row"]["dashboard_status"];
}

export default function PieChart(props: PropsInterface) {
  const {
    title,
    subtitle,
    showLegend = true,
    colors = COLORS,
    rawData,
    dashboardStatus,
  } = props;

  const aggregated = useMemo(() => {
    const grouped = rawData.reduce<Record<string, number>>((acc, row) => {
      if (!row) return acc;
      if (row.dashboard_status !== dashboardStatus) return acc;
      if (!row.ip_type) return acc;

      acc[row.ip_type] = (acc[row.ip_type] ?? 0) + (row.total ?? 0);
      return acc;
    }, {});

    return Object.entries(grouped).map(([ipType, total]) => ({
      ipType,
      total,
    }));
  }, [rawData, dashboardStatus]);

  const series = aggregated.map((item) => item.total);
  const labels = aggregated.map((item) => ipTypeToTitle(item.ipType));

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      width: "100%",
      height: 320,
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: showLegend,
      position: "bottom",
      fontSize: "13px",
      labels: {
        colors: "#667085",
      },
    },
    colors,
    labels,
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "58%",
          labels: {
            show: false,
          },
        },
      },
    },
    stroke: {
      width: 0,
    },
    fill: {
      type: "solid",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 280,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="shadow-default space-y-2 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <p className="text-theme-sm mt-1 font-normal text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>

      {!series.length ? (
        <div className="flex min-h-[320px] w-full items-center justify-center rounded-xl border border-gray-100 bg-gray-50/60">
          <div className="flex flex-col items-center px-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
              <PieChartIcon className="h-5 w-5 text-gray-400" />
            </div>

            <p className="text-sm font-medium text-gray-700">
              No data available
            </p>
            <p className="mt-1 max-w-[220px] text-xs leading-5 text-gray-500">
              There is no data to visualize for this status.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            width="100%"
            height={320}
          />
        </div>
      )}
    </div>
  );
}
