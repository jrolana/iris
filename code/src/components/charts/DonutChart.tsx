"use client";

import { ApexOptions } from "apexcharts";
import ThreeSummary from "../common/ThreeSummary";
import dynamic from "next/dynamic";

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
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels,
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
  };

  return (
    <div className="shadow-default relative rounded-2xl border border-gray-200 bg-gray-100">
      <div className="rounded-2xl bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

        <div className="mt-4 h-[250px] w-full sm:h-[300px]">
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            width="100%"
            height="100%"
          />
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        <ThreeSummary />
      </div>
    </div>
  );
}
