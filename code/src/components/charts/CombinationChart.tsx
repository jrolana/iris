"use client";
import React from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { COLORS } from "@/lib/constants/ui";
import { COMBINATION_SERIES } from "@/lib/dummy-data/metrics";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PropsInterface {
  title: string;
  showLegend?: boolean;
}

export default function CombinationChart(props: PropsInterface) {
  const { title, showLegend = false } = props;
  const options: ApexOptions = {
    legend: {
      show: showLegend,
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: "#344054",
      },
    },
    colors: ["#465FFF", "#5A6FFF", "#7080FF", "#3745A0", "#2A3380"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [0, 0, 0, 0, 0, 1], // Line width for each dataset
    },

    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: [
        "2013 - 2017",
        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025,
      ],
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = COMBINATION_SERIES;

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

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
