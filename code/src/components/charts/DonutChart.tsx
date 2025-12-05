"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ThreeSummary from "../common/ThreeSummary";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PropsInterface {
  title: string;
  subtitle?: string;
  colors?: string[];
  series?: number[];
  labels?: string[];
}

export default function DonutChart(props: PropsInterface) {
  const {
    title,
    subtitle = "Grant rate of filed IPs",
    colors = ["#465FFF"],
    series = [75.68],
    labels = ["Progress"],
  } = props;
  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      fontFamily: "Outfit, sans-serif",
      width: "100%",
    },
    colors: colors,
    labels: labels,
    legend: {
      show: false,
    },
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
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -20,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#FF7F1F"],
    },
    stroke: {
      lineCap: "round",
    },
  };

  return (
    <div className="shadow-default space-y-2 rounded-2xl border border-gray-200 bg-gray-100">
      <div className="rounded-2xl bg-white px-5 pt-5 pb-10">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-theme-sm mt-1 font-normal text-gray-500">
          {subtitle}
        </p>
        <div className="h-40 w-full">
          <ReactApexChart options={options} series={series} type="radialBar" />
        </div>
      </div>
      <ThreeSummary />
    </div>
  );
}
