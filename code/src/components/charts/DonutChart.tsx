"use client";

import { ApexOptions } from "apexcharts";
import ThreeSummary from "../common/ThreeSummary";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { DashboardAnalyticsType } from "@/lib/types/views";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type DashboardStatus = DashboardAnalyticsType["Row"]["dashboard_status"];

interface PropsInterface {
  title: string;
  subtitle?: string;
  colors?: string[];
  rawData: DashboardAnalyticsType["Row"][];
  numeratorStatus?: DashboardStatus;
  denominatorStatus?: DashboardStatus;
}

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

export default function DonutChart(props: PropsInterface) {
  const {
    title,
    subtitle = "Grant rate of filed IPs",
    colors = ["#465FFF"],
    rawData,
    numeratorStatus = "granted",
    denominatorStatus = "filed",
  } = props;

  const metrics = useMemo<SummaryMetrics>(() => {
    const validRows = rawData.filter(
      (item) =>
        item &&
        item.dashboard_status !== null &&
        item.total !== null &&
        item.year !== null,
    );

    const years = Array.from(
      new Set(
        validRows
          .map((item) => Number(item.year))
          .filter((year) => !Number.isNaN(year))
          .sort((a, b) => a - b),
      ),
    );

    const computeTotalsAndRate = (rows: DashboardAnalyticsType["Row"][]) => {
      const numerator = rows
        .filter((item) => item.dashboard_status === numeratorStatus)
        .reduce((sum, item) => sum + Number(item.total ?? 0), 0);

      const denominator = rows
        .filter((item) => item.dashboard_status === denominatorStatus)
        .reduce((sum, item) => sum + Number(item.total ?? 0), 0);

      const rate =
        denominator > 0
          ? Number(((numerator / denominator) * 100).toFixed(2))
          : 0;

      return {
        numerator,
        denominator,
        rate,
      };
    };

    const overall = computeTotalsAndRate(validRows);

    const currentYear = years.length ? years[years.length - 1] : null;
    const previousYear = years.length >= 2 ? years[years.length - 2] : null;

    let currentFiled = 0;
    let previousFiled = 0;
    let currentGranted = 0;
    let previousGranted = 0;
    let currentRate = 0;
    let previousRate = 0;
    let hasYearComparison = false;

    if (currentYear !== null) {
      const currentRows = validRows.filter(
        (item) => Number(item.year) === currentYear,
      );
      const current = computeTotalsAndRate(currentRows);

      currentFiled = current.denominator;
      currentGranted = current.numerator;
      currentRate = current.rate;
    }

    if (previousYear !== null) {
      const previousRows = validRows.filter(
        (item) => Number(item.year) === previousYear,
      );
      const previous = computeTotalsAndRate(previousRows);

      previousFiled = previous.denominator;
      previousGranted = previous.numerator;
      previousRate = previous.rate;
      hasYearComparison = true;
    }

    return {
      overallRate: overall.rate,
      currentFiled,
      previousFiled,
      currentGranted,
      previousGranted,
      currentRate,
      previousRate,
      currentYear,
      previousYear,
      hasYearComparison,
    };
  }, [rawData, numeratorStatus, denominatorStatus]);

  const series = [metrics.overallRate];

  const options: ApexOptions = {
    chart: {
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
  };

  console.log("DonutChart rerender");
  console.log("rawData ref changed?", rawData);
  console.log("metrics", metrics);

  return (
    <div className="shadow-default relative rounded-2xl border border-gray-200 bg-gray-100">
      <div className="rounded-2xl bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

        <div className="mt-4 h-[250px] w-full sm:h-[300px]">
          <ReactApexChart
            key={`${metrics.overallRate}-${metrics.currentYear}-${metrics.previousYear}-${rawData.length}`}
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
