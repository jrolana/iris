"use client";

import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { BarChart3 } from "lucide-react";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { IP_TYPE_COLOR_MAP, FALLBACK_IP_COLOR } from "@/lib/constants/ui";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => null,
});

interface PropsInterface {
  title: string;
  showLegend?: boolean;
  data: {
    categories: number[];
    activeIpTypes: string[];
    groupedByIPAndYear: Record<string, Record<number, number>>;
  };
  chartId?: string;
}

type SeriesItemType = {
  name: string;
  data: number[];
};

function EmptyState({ height }: { height: number }) {
  return (
    <div
      className="flex w-full items-center justify-center rounded-xl border border-gray-100 bg-gray-50/60"
      style={{ height }}
    >
      <div className="flex flex-col items-center px-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>

        <p className="text-sm font-medium text-gray-700">No data available</p>
        <p className="mt-1 max-w-[240px] text-xs leading-5 text-gray-500">
          There is no data to visualize for the selected status yet.
        </p>
      </div>
    </div>
  );
}

function BarChart(props: PropsInterface) {
  const { title, showLegend = true, data, chartId } = props;
  const { categories, activeIpTypes, groupedByIPAndYear } = data;

  const CHART_HEIGHT = 310;

  const subtitle = useMemo(() => {
    if (!categories.length) return "IP applications submitted each year";

    if (categories.length === 1) {
      return `IP applications submitted in ${categories[0]}`;
    }

    return `IP applications submitted from ${categories[0]} to ${
      categories[categories.length - 1]
    }`;
  }, [categories]);

  const series: SeriesItemType[] = useMemo(() => {
    return activeIpTypes.map((ipType) => ({
      name: ipTypeToTitle(ipType),
      data: categories.map((year) => groupedByIPAndYear[ipType]?.[year] ?? 0),
    }));
  }, [activeIpTypes, groupedByIPAndYear, categories]);

  const seriesColors = useMemo(() => {
    return activeIpTypes.map(
      (ipType) => IP_TYPE_COLOR_MAP[ipType] ?? FALLBACK_IP_COLOR,
    );
  }, [activeIpTypes]);

  const options: ApexOptions = useMemo(
    () => ({
      legend: {
        show: showLegend,
        position: "top",
        horizontalAlign: "left",
        labels: {
          colors: "#344054",
        },
      },
      colors: seriesColors,
      chart: {
        id: chartId,
        fontFamily: "Outfit, sans-serif",
        height: CHART_HEIGHT,
        width: "100%",
        type: "bar",
        stacked: false,
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "52%",
          borderRadius: 4,
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
        strokeDashArray: 4,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        y: {
          formatter: (value) => Math.round(Number(value) || 0).toString(),
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
        labels: {
          style: {
            fontSize: "12px",
            colors: "#6B7280",
          },
        },
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: (value) => Math.round(value).toString(),
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
        },
        title: {
          text: "",
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: CHART_HEIGHT,
            },
            legend: {
              position: "bottom",
            },
            plotOptions: {
              bar: {
                columnWidth: "60%",
              },
            },
          },
        },
      ],
    }),
    [showLegend, seriesColors, chartId, categories],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-theme-sm mt-1 text-gray-500">{subtitle}</p>
        </div>
      </div>

      {!activeIpTypes.length || !categories.length ? (
        <EmptyState height={CHART_HEIGHT} />
      ) : (
        <div className="custom-scrollbar max-w-full overflow-x-auto">
          <div className="w-full min-w-0">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              width="100%"
              height={CHART_HEIGHT}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(BarChart);
