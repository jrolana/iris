"use client";

import { memo, useMemo } from "react";
import { ApexOptions } from "apexcharts";
import ThreeSummary from "../common/ThreeSummary";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type SummaryMetrics = {
  overallRate: number;
  currentFiled: number;
  previousFiled: number;
  currentGranted: number;
  previousGranted: number;
  currentRate: number;
  previousRate: number;
  currentYear: number | null;
  previousYear: number | null;
  hasYearComparison: boolean;
};

interface PropsInterface {
  title: string;
  subtitle?: string;
  colors?: string[];
  metrics: SummaryMetrics;
  chartId?: string;
}

function DonutChart(props: PropsInterface) {
  const {
    title,
    subtitle = "Grant rate of filed IPs",
    colors = ["#465FFF"],
    metrics,
    chartId,
  } = props;

  const series = useMemo(() => [metrics.overallRate], [metrics.overallRate]);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        id: chartId,
        type: "radialBar",
        fontFamily: "Outfit, sans-serif",
        sparkline: {
          enabled: true,
        },
      },
      colors,
      labels: ["Progress"],
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          startAngle: -80,
          endAngle: 80,
          hollow: {
            size: "75%",
          },
          track: {
            background: "#E4E7EC",
            margin: 0,
          },
          dataLabels: {
            name: { show: false },
            value: {
              fontSize: "32px",
              fontWeight: "600",
              offsetY: -8,
              color: "#1D2939",
              formatter: (val: number) => `${val}%`,
            },
          },
        },
      },
      fill: {
        type: "solid",
      },
      stroke: {
        lineCap: "round",
      },
    }),
    [chartId, colors],
  );

  return (
    <div className="shadow-default relative rounded-2xl border border-gray-200 bg-gray-100">
      <div className="rounded-2xl bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

        <div className="mt-4 h-[250px] w-full sm:h-[300px]">
          <ReactApexChart
            key={`${chartId}-${metrics.overallRate}-${metrics.currentYear}-${metrics.previousYear}`}
            options={options}
            series={series}
            type="radialBar"
            width="100%"
            height="100%"
          />
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        <ThreeSummary
          currentFiled={metrics.currentFiled}
          previousFiled={metrics.previousFiled}
          currentGranted={metrics.currentGranted}
          previousGranted={metrics.previousGranted}
          currentRate={metrics.currentRate}
          previousRate={metrics.previousRate}
          currentYear={metrics.currentYear}
          previousYear={metrics.previousYear}
          hasYearComparison={metrics.hasYearComparison}
        />
      </div>
    </div>
  );
}

export default memo(DonutChart);
