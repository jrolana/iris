"use client";

import { memo, useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import {
  COLORS,
  IP_TYPE_COLOR_MAP,
  FALLBACK_IP_COLOR,
} from "@/lib/constants/ui";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { PieChartIcon } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type PieChartDatum = {
  ipType: string;
  total: number;
};

interface PropsInterface {
  title: string;
  subtitle: string;
  showLegend?: boolean;
  colors?: string[];
  data: PieChartDatum[];
  chartId?: string;
}

function PieChart(props: PropsInterface) {
  const {
    title,
    subtitle,
    showLegend = true,
    colors = COLORS,
    data,
    chartId,
  } = props;

  const CHART_HEIGHT = 250;

  const series = useMemo(() => data.map((item) => item.total), [data]);

  const labels = useMemo(
    () => data.map((item) => ipTypeToTitle(item.ipType)),
    [data],
  );

  const chartColors = useMemo(() => {
    return data.map(
      (item) => IP_TYPE_COLOR_MAP[item.ipType] ?? FALLBACK_IP_COLOR,
    );
  }, [data]);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        id: chartId,
        type: "donut",
        fontFamily: "Outfit, sans-serif",
        width: "100%",
        height: CHART_HEIGHT,
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
      colors: chartColors.length ? chartColors : colors,
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
              height: CHART_HEIGHT,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    }),
    [chartId, showLegend, chartColors, colors, labels],
  );

  return (
    <div className="shadow-default flex h-full flex-col space-y-2 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6">
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
        <div
          className="flex w-full items-center justify-center rounded-xl border border-gray-100 bg-gray-50/60"
          style={{ minHeight: `${CHART_HEIGHT}px` }}
        >
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
        <div
          className="w-full overflow-hidden"
          style={{ minHeight: `${CHART_HEIGHT}px` }}
        >
          <ReactApexChart
            key={`${chartId}-${labels.join("|")}-${series.join("|")}`}
            options={options}
            series={series}
            type="donut"
            width="100%"
            height={CHART_HEIGHT}
          />
        </div>
      )}
    </div>
  );
}

export default memo(PieChart);
