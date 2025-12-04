"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PropsInterface {
  title: string;
  subtitle: string;
  showLegend?: boolean;
  colors?: string[];
  series?: number[];
  labels?: string[];
}

export default function PieChart(props: PropsInterface) {
  const {
    title,
    subtitle,
    showLegend = true,
    colors = ["#465FFF", "#5A6FFF", "#7080FF", "#3745A0", "#2A3380"],
    series = [6.7, 34.4, 44.5, 12.4, 1.9],
    labels = [
      "Industrial Design",
      "Copyright",
      "Trademark",
      "Patent",
      "Utility Model",
    ],
  } = props;
  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      width: "100%",
    },
    legend: {
      show: showLegend,
      position: "bottom",
    },
    colors: colors,
    labels: labels,
    dataLabels: {
      enabled: false,
      formatter: function (val, opts) {
        return opts.w.globals.series[opts.seriesIndex];
      },
      style: {
        fontSize: "14px",
        fontWeight: "medium",
        fontFamily: "Outfit, sans-serif",
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: false,
          },
        },
      },
    },
    fill: { type: "solid" },
    stroke: { lineCap: "round" },
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
      <div className="w-full">
        <ReactApexChart options={options} series={series} type="donut" />
      </div>
    </div>
  );
}
