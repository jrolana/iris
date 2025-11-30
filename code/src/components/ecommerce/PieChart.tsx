"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function PieChart() {
  const series = [6.7, 34.4, 44.5, 12.4, 1.9];
  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      width: "100%",
    },
    colors: ["#465FFF", "#5A6FFF", "#7080FF", "#3745A0", "#2A3380"],
    labels: [
      "Industrial Design",
      "Copyright",
      "Trademark",
      "Patent",
      "Utility Model",
    ],
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
    <div className="shadow-default space-y-2 rounded-2xl bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6 dark:bg-gray-900">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Filed IP
          </h3>
          <p className="text-theme-sm mt-1 font-normal text-gray-500 dark:text-gray-400">
            Total filed IPs by type since 2013
          </p>
        </div>
      </div>
      <div className="w-[350px]">
        <ReactApexChart options={options} series={series} type="donut" />
      </div>
    </div>
  );
}
