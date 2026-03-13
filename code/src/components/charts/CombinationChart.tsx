"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { DashboardAnalyticsType } from "@/lib/types/views";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { useMemo } from "react";
import { BarChart3 } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PropsInterface {
  title: string;
  showLegend?: boolean;
  dashboardStatus: DashboardAnalyticsType["Row"]["dashboard_status"];
  rawData: DashboardAnalyticsType["Row"][];
}

type SeriesItemType = {
  name: string;
  type: "column" | "line";
  data: number[];
};

const IP_TYPE_ORDER = [
  "patent",
  "utility_model",
  "industrial_design",
  "copyright",
  "trademark",
] as const;

export default function CombinationChart(props: PropsInterface) {
  const { title, showLegend = false, dashboardStatus, rawData } = props;

  const filteredRows = useMemo(() => {
    return rawData.filter((item) => {
      return (
        !!item &&
        item.dashboard_status === dashboardStatus &&
        !!item.ip_type &&
        item.year !== null
      );
    });
  }, [rawData, dashboardStatus]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(filteredRows.map((item) => Number(item.year))),
    ).sort((a, b) => a - b);
  }, [filteredRows]);

  const groupedByIPAndYear = useMemo(() => {
    return filteredRows.reduce<Record<string, Record<number, number>>>(
      (acc, item) => {
        if (!item.ip_type || item.year === null) return acc;

        const ipType = item.ip_type;
        const year = Number(item.year);

        if (!acc[ipType]) {
          acc[ipType] = {};
        }

        // rawData is grouped by ip_type, dashboard_status, year already so no further manipulation is needed
        // shaped as
        // {
        //   ipType: {
        //      year,
        //   }
        // }
        acc[ipType][year] = item.total ?? 0;
        return acc;
      },
      {},
    );
  }, [filteredRows]);

  const columnSeries: SeriesItemType[] = useMemo(() => {
    return IP_TYPE_ORDER.filter((ipType) => groupedByIPAndYear[ipType]).map(
      (ipType) => ({
        name: ipTypeToTitle(ipType),
        type: "column",
        // map each year and corresponding total
        data: categories.map((year) => groupedByIPAndYear[ipType][year] ?? 0),
      }),
    );
  }, [groupedByIPAndYear, categories]);

  // total values across different IP types
  const actualTotalSeries = useMemo<number[]>(() => {
    return categories.map((year) =>
      Object.values(groupedByIPAndYear).reduce(
        (sum, totalsByYear) => sum + (totalsByYear[year] ?? 0),
        0,
      ),
    );
  }, [categories, groupedByIPAndYear]);

  // scaled for better UI
  // so that vertical gap between the actual total line series and the column series are not that big
  const totalSeries: SeriesItemType = useMemo(() => {
    const maxColumnValue = Math.max(
      1,
      ...columnSeries.flatMap((series) => series.data),
    );

    const maxActualTotal = Math.max(1, ...actualTotalSeries);

    // Lower multiplier = line sits closer to the columns
    const targetLineMax = maxColumnValue * 1.08;

    return {
      name: "Total",
      type: "line",
      data: actualTotalSeries.map(
        (value) => (value / maxActualTotal) * targetLineMax,
      ),
    };
  }, [columnSeries, actualTotalSeries]);

  const series: SeriesItemType[] = useMemo(() => {
    return [...columnSeries, totalSeries];
  }, [columnSeries, totalSeries]);

  const strokeWidths = useMemo(() => {
    return series.map((item) => (item.type === "line" ? 1 : 0));
  }, [series]);

  const options: ApexOptions = {
    legend: {
      show: showLegend,
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: "#344054",
      },
    },
    colors: ["#465FFF", "#5A6FFF", "#7080FF", "#3745A0", "#2A3380", "#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      width: "100%",
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: strokeWidths,
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      shared: true,
      y: {
        formatter: (value, { seriesIndex, dataPointIndex, w }) => {
          const seriesName = w.config.series?.[seriesIndex]?.name;

          if (seriesName === "Total") {
            return Math.round(
              actualTotalSeries[dataPointIndex] ?? 0,
            ).toString();
          }

          return Math.round(Number(value) || 0).toString();
        },
      },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (value) => Math.round(value).toString(),
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
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
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-theme-sm mt-1 text-gray-500">
            IP applications submitted each year
          </p>
        </div>
      </div>

      {!filteredRows.length || !categories.length ? (
        <div className="flex h-[310px] w-full items-center justify-center rounded-xl border border-gray-100 bg-gray-50/60">
          <div className="flex flex-col items-center px-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>

            <p className="text-sm font-medium text-gray-700">
              No data available
            </p>
            <p className="mt-1 max-w-[240px] text-xs leading-5 text-gray-500">
              There is no data to visualize for the selected status yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="custom-scrollbar max-w-full overflow-x-auto">
          <div className="w-full min-w-0">
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              width="100%"
              height={310}
            />
          </div>
        </div>
      )}
    </div>
  );
}
