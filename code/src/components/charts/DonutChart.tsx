"use client";

import { memo } from "react";
import ThreeSummary from "../common/ThreeSummary";

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

  const rate = Math.max(0, Math.min(100, metrics.overallRate || 0));
  const displayRate = Number.isInteger(rate) ? rate.toString() : rate.toFixed(2);
  const progressColor = colors[0] ?? "#465FFF";

  const radius = 86;
  const strokeWidth = 18;
  const halfCircumference = Math.PI * radius;

  const progressLength = (rate / 100) * halfCircumference;
  const remainingLength = halfCircumference - progressLength;

  const arcPath = "M 24 110 A 86 86 0 0 1 196 110";

  return (
    <div
      id={chartId}
      className="shadow-default overflow-hidden rounded-2xl border border-gray-200 bg-white"
    >
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

        <div className="mt-6 flex w-full items-center justify-center">
          <div className="relative mx-auto h-[150px] w-[220px]">
            <svg
              viewBox="0 0 220 140"
              className="block h-full w-full"
              role="img"
              aria-label={`Grant rate is ${displayRate}%`}
            >
              <path
                d={arcPath}
                fill="none"
                stroke="#E4E7EC"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {rate > 0 && (
                <path
                  d={arcPath}
                  fill="none"
                  stroke={progressColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${progressLength} ${remainingLength}`}
                />
              )}
            </svg>

            <div className="absolute inset-x-0 top-[74px] flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-semibold text-gray-800">
                {displayRate}%
              </span>
              <span className="mt-1 text-xs text-gray-500">Grant Rate</span>
            </div>
          </div>
        </div>
      </div>

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
  );
}

export default memo(DonutChart);