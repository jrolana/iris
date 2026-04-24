"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { ANALOGOUS_COLORS } from "@/lib/constants/ui";
import { useGetDashboardAnalytics } from "@/hooks/views/useGetDashboardAnalytics";
import { START_YEAR } from "@/lib/constants/dashboard_analytics";
import { cn } from "@/lib/utils";
import { DashboardAnalyticsType } from "@/lib/types/views";
import {
  DashboardFilters,
  PRESET_LABELS,
  TIMELINE_PRESETS,
  TimelinePreset,
  getRangeFromPreset,
} from "@/lib/dashboard/dashboard-filters";
import {
  buildSummaryTableRows,
  buildSummaryTotals,
  STATUS_ORDER,
} from "@/lib/dashboard/dashboard-summary";
import {
  PDF_EXPORT_CHARTS,
  PDF_EXPORT_CHARTS_NO_PIE,
  PIE_CHARTS,
  TREND_CHARTS,
} from "@/lib/dashboard/dashboard";
import { IP_TYPES } from "@/lib/types/ip";

function ChartSkeleton({ height = "h-[320px]" }: { height?: string }) {
  return (
    <div
      className={cn(height, "rounded-2xl border border-gray-200 bg-white p-4")}
    >
      <div className="mb-4 h-5 w-40 rounded bg-gray-100" />
      <div className="h-[calc(100%-2rem)] rounded-xl bg-gray-50" />
    </div>
  );
}

function OverviewKpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5"
        >
          <div className="mb-4 h-4 w-24 rounded bg-gray-100" />
          <div className="mb-3 h-8 w-20 rounded bg-gray-100" />
          <div className="h-3 w-32 rounded bg-gray-50" />
        </div>
      ))}
    </div>
  );
}

function SummaryTableSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-5 h-6 w-56 rounded bg-gray-100" />

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 border-b border-gray-50 pb-3"
          >
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 rounded bg-gray-50" />
            <div className="h-4 rounded bg-gray-50" />
            <div className="h-4 rounded bg-gray-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

const DonutChart = dynamic(() => import("@/components/charts/DonutChart"), {
  ssr: false,
  loading: () => <ChartSkeleton height="h-[360px]" />,
});

const OverviewKPIs = dynamic(() => import("../dashboard/OverviewKPIs"), {
  ssr: false,
  loading: () => <OverviewKpiSkeleton />,
});

const DashboardSummaryTable = dynamic(
  () => import("@/components/dashboard/DashboardSummaryTable"),
  {
    ssr: false,
    loading: () => <SummaryTableSkeleton />,
  },
);

const PieChart = dynamic(() => import("@/components/charts/PieChart"), {
  ssr: false,
  loading: () => <ChartSkeleton height="h-[320px]" />,
});

const BarChart = dynamic(() => import("@/components/charts/BarChart"), {
  ssr: false,
  loading: () => <ChartSkeleton height="h-[360px]" />,
});

const ExportMenu = dynamic(() => import("@/components/dashboard/ExportMenu"), {
  ssr: false,
  loading: () => (
    <div className="h-11 w-28 rounded-lg border border-gray-200 bg-gray-50" />
  ),
});

type YearSelectProps = {
  label: string;
  value: number;
  years: number[];
  disabled: boolean;
  onChange: (value: number) => void;
};

type PieChartDatum = {
  ipType: string;
  total: number;
};

type CombinationChartData = {
  categories: number[];
  activeIpTypes: string[];
  groupedByIPAndYear: Record<string, Record<number, number>>;
};

type DonutMetrics = {
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

type LazyMountProps = {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
};

function LazyMount({
  children,
  fallback = <ChartSkeleton />,
  rootMargin = "100px",
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;

    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
}

function YearSelect({
  label,
  value,
  years,
  disabled,
  onChange,
}: YearSelectProps) {
  const selectId = `year-select-${label.toLowerCase()}`;

  return (
    <div className="min-w-[140px]">
      <label
        htmlFor={selectId}
        className="mb-1.5 block text-xs font-medium tracking-wide text-gray-600 uppercase"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          name={selectId}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-xl border px-3 py-2.5 pr-10 text-sm transition outline-none",
            disabled
              ? "border-gray-200 bg-gray-50 text-gray-500"
              : "focus:border-brand-500 border-gray-300 bg-white text-gray-700",
          )}
        >
          {years.map((year) => (
            <option key={`${label}-${year}`} value={year}>
              {year}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

type DashboardViewMode = "default" | "no_pie";

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardAnalytics();
  const currentYear = new Date().getFullYear();
  // handles mode directly here
  const [viewMode, setViewMode] = useState<DashboardViewMode>("no_pie");
  const showPieCharts = viewMode === "default";

  const [filters, setFilters] = useState<DashboardFilters>({
    preset: "current_year",
    yearFrom: currentYear,
    yearTo: currentYear,
  });

  const sourceData = useMemo<DashboardAnalyticsType[]>(() => {
    return [...((data ?? []) as DashboardAnalyticsType[])].sort(
      (a, b) => Number(a.year) - Number(b.year),
    );
  }, [data]);

  const availableYears = useMemo(() => {
    const years = sourceData
      .map((item) => item.year)
      .filter((year): year is number => year !== null)
      .map(Number)
      .sort((a, b) => a - b);

    return Array.from(new Set(years));
  }, [sourceData]);

  const minAvailableYear = availableYears[0] ?? START_YEAR;
  const maxAvailableYear =
    availableYears[availableYears.length - 1] ?? currentYear;

  const selectableYears = availableYears.length
    ? availableYears
    : [currentYear];

  useEffect(() => {
    if (!availableYears.length) return;

    setFilters((prev) => {
      const nextRange = getRangeFromPreset(
        prev.preset,
        minAvailableYear,
        maxAvailableYear,
        currentYear,
        prev,
      );

      if (
        prev.yearFrom === nextRange.yearFrom &&
        prev.yearTo === nextRange.yearTo
      ) {
        return prev;
      }

      return {
        ...prev,
        ...nextRange,
      };
    });
  }, [availableYears, minAvailableYear, maxAvailableYear, currentYear]);

  const handlePresetChange = (preset: TimelinePreset) => {
    if (preset === "custom") {
      setFilters((prev) => ({ ...prev, preset: "custom" }));
      return;
    }

    setFilters((prev) => ({
      preset,
      ...getRangeFromPreset(
        preset,
        minAvailableYear,
        maxAvailableYear,
        currentYear,
        prev,
      ),
    }));
  };

  const handleCustomYearFromChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      preset: "custom",
      yearFrom: value,
      yearTo: Math.max(value, prev.yearTo),
    }));
  };

  const handleCustomYearToChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      preset: "custom",
      yearFrom: Math.min(value, prev.yearFrom),
      yearTo: value,
    }));
  };

  const filteredData = useMemo(() => {
    return sourceData.filter((item) => {
      if (item.year === null) return false;

      const year = Number(item.year);
      return year >= filters.yearFrom && year <= filters.yearTo;
    });
  }, [sourceData, filters.yearFrom, filters.yearTo]);

  const pieChartDataByStatus = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};

    for (const row of filteredData) {
      if (!row?.dashboard_status || !row.ip_type) continue;

      const status = row.dashboard_status;
      const ipType = row.ip_type;

      if (!grouped[status]) {
        grouped[status] = {};
      }

      grouped[status][ipType] =
        (grouped[status][ipType] ?? 0) + Number(row.total ?? 0);
    }

    const result: Record<string, PieChartDatum[]> = {};

    for (const [status, values] of Object.entries(grouped)) {
      result[status] = Object.entries(values).map(([ipType, total]) => ({
        ipType,
        total,
      }));
    }

    return result;
  }, [filteredData]);

  const combinationChartDataByStatus = useMemo(() => {
    const result = {} as Record<string, CombinationChartData>;
    const yearsByStatus: Record<string, Set<number>> = {};

    for (const status of STATUS_ORDER) {
      if (!status) continue;

      result[status] = {
        categories: [],
        activeIpTypes: [],
        groupedByIPAndYear: {},
      };

      yearsByStatus[status] = new Set<number>();
    }

    for (const row of filteredData) {
      if (!row?.dashboard_status || !row.ip_type || row.year === null) {
        continue;
      }

      const status = row.dashboard_status;
      const ipType = row.ip_type;
      const year = Number(row.year);

      if (!result[status]) {
        result[status] = {
          categories: [],
          activeIpTypes: [],
          groupedByIPAndYear: {},
        };

        yearsByStatus[status] = new Set<number>();
      }

      yearsByStatus[status].add(year);

      if (!result[status].groupedByIPAndYear[ipType]) {
        result[status].groupedByIPAndYear[ipType] = {};
      }

      result[status].groupedByIPAndYear[ipType][year] =
        (result[status].groupedByIPAndYear[ipType][year] ?? 0) +
        Number(row.total ?? 0);
    }

    for (const status of Object.keys(result)) {
      result[status].categories = Array.from(yearsByStatus[status] ?? []).sort(
        (a, b) => a - b,
      );

      result[status].activeIpTypes = IP_TYPES.filter(
        (ipType) => result[status].groupedByIPAndYear[ipType],
      );
    }

    return result;
  }, [filteredData]);

  const grantRateMetrics = useMemo<DonutMetrics>(() => {
    const byYear: Record<number, { filed: number; granted: number }> = {};
    let totalFiled = 0;
    let totalGranted = 0;

    for (const item of filteredData) {
      if (
        !item?.dashboard_status ||
        item.total === null ||
        item.year === null
      ) {
        continue;
      }

      const year = Number(item.year);
      const total = Number(item.total ?? 0);

      if (Number.isNaN(year)) continue;

      if (!byYear[year]) {
        byYear[year] = { filed: 0, granted: 0 };
      }

      if (item.dashboard_status === "filed") {
        byYear[year].filed += total;
        totalFiled += total;
      }

      if (item.dashboard_status === "granted") {
        byYear[year].granted += total;
        totalGranted += total;
      }
    }

    const years = Object.keys(byYear)
      .map(Number)
      .sort((a, b) => a - b);

    const latestYear = years.length ? years[years.length - 1] : null;
    const previousYear = years.length >= 2 ? years[years.length - 2] : null;

    const currentFiled =
      latestYear !== null ? (byYear[latestYear]?.filed ?? 0) : 0;

    const currentGranted =
      latestYear !== null ? (byYear[latestYear]?.granted ?? 0) : 0;

    const previousFiled =
      previousYear !== null ? (byYear[previousYear]?.filed ?? 0) : 0;

    const previousGranted =
      previousYear !== null ? (byYear[previousYear]?.granted ?? 0) : 0;

    const toRate = (granted: number, filed: number) =>
      filed > 0 ? Number(((granted / filed) * 100).toFixed(2)) : 0;

    return {
      overallRate: toRate(totalGranted, totalFiled),
      currentFiled,
      previousFiled,
      currentGranted,
      previousGranted,
      currentRate: toRate(currentGranted, currentFiled),
      previousRate: toRate(previousGranted, previousFiled),
      currentYear: latestYear,
      previousYear,
      hasYearComparison: previousYear !== null,
    };
  }, [filteredData]);

  const summaryTableRows = useMemo(
    () => buildSummaryTableRows(filteredData),
    [filteredData],
  );

  const summaryTotals = useMemo(
    () => buildSummaryTotals(summaryTableRows),
    [summaryTableRows],
  );

  const pieSubtitle = `By IP type, ${filters.yearFrom}–${filters.yearTo}`;
  const exportCharts = showPieCharts
    ? PDF_EXPORT_CHARTS
    : PDF_EXPORT_CHARTS_NO_PIE;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="mt-3 mb-2 lg:col-span-6">
          <h1 className="text-2xl font-bold text-gray-700">
            IP Portfolio Overview
          </h1>
        </div>

        <div className="mt-3 mb-2 flex justify-end lg:col-span-6">
          <ExportMenu
            yearFrom={filters.yearFrom}
            yearTo={filters.yearTo}
            summaryTableRows={summaryTableRows}
            summaryTotals={summaryTotals}
            chartExports={exportCharts}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:col-span-12">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-800">
                Reporting Period
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select the year range for all charts, summaries, and exports.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {TIMELINE_PRESETS.map((preset) => {
                const isActive = filters.preset === preset;

                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetChange(preset)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition",
                      isActive
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                    )}
                  >
                    {PRESET_LABELS[preset]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("default")}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition",
                    viewMode === "default"
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                  )}
                >
                  Standard View
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("no_pie")}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition",
                    viewMode === "no_pie"
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                  )}
                >
                  No Pie Charts
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <YearSelect
                  label="From"
                  value={filters.yearFrom}
                  years={selectableYears}
                  disabled={isLoading || filters.preset !== "custom"}
                  onChange={handleCustomYearFromChange}
                />

                <YearSelect
                  label="To"
                  value={filters.yearTo}
                  years={selectableYears}
                  disabled={isLoading || filters.preset !== "custom"}
                  onChange={handleCustomYearToChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium">Range:</span> {filters.yearFrom}–
                {filters.yearTo}
              </div>

              <div className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium">Preset:</span>{" "}
                {PRESET_LABELS[filters.preset]}
              </div>

              <div className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium">View:</span>{" "}
                {viewMode === "default" ? "Standard" : "No Pie Charts"}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 lg:col-span-12">
          <h2 className="text-xl font-semibold text-gray-800">
            Portfolio Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {showPieCharts
              ? "View status distribution and grant rate for the selected years."
              : "View grant rate and high-level portfolio metrics for the selected years."}
          </p>
        </div>

        <div className="lg:col-span-12">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              {isLoading ? (
                <ChartSkeleton height="h-[360px]" />
              ) : (
                <DonutChart
                  chartId="dashboard-grant-rate-donut"
                  title="Grant Rate"
                  subtitle={`Percent of filed applications that were granted, ${filters.yearFrom}–${filters.yearTo}`}
                  metrics={grantRateMetrics}
                />
              )}
            </div>

            <div className="lg:col-span-7">
              {isLoading ? (
                <OverviewKpiSkeleton />
              ) : (
                <LazyMount fallback={<OverviewKpiSkeleton />}>
                  <OverviewKPIs
                    rawData={filteredData}
                    yearFrom={filters.yearFrom}
                    yearTo={filters.yearTo}
                  />
                </LazyMount>
              )}
            </div>
          </div>
        </div>

        {showPieCharts ? (
          <div className="space-y-4 lg:col-span-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {PIE_CHARTS.slice(0, 2).map((chart) =>
                isLoading ? (
                  <ChartSkeleton key={chart.chartId} height="h-[320px]" />
                ) : (
                  <LazyMount
                    key={chart.chartId}
                    fallback={<ChartSkeleton height="h-[320px]" />}
                  >
                    <PieChart
                      chartId={chart.chartId}
                      title={chart.title}
                      subtitle={pieSubtitle}
                      colors={ANALOGOUS_COLORS}
                      data={pieChartDataByStatus[chart.status] ?? []}
                    />
                  </LazyMount>
                ),
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PIE_CHARTS.slice(2).map((chart) =>
                isLoading ? (
                  <ChartSkeleton key={chart.chartId} height="h-[320px]" />
                ) : (
                  <LazyMount
                    key={chart.chartId}
                    fallback={<ChartSkeleton height="h-[320px]" />}
                  >
                    <PieChart
                      chartId={chart.chartId}
                      title={chart.title}
                      subtitle={pieSubtitle}
                      colors={ANALOGOUS_COLORS}
                      data={pieChartDataByStatus[chart.status] ?? []}
                    />
                  </LazyMount>
                ),
              )}
            </div>
          </div>
        ) : null}

        <div className="border-t border-gray-100 pt-6 lg:col-span-12">
          <h2 className="text-2xl font-bold text-gray-700">
            Application Trends by Status
          </h2>
        </div>

        {TREND_CHARTS.slice(0, 3).map((chart) => (
          <div key={chart.chartId} className={chart.colSpan}>
            {isLoading ? (
              <ChartSkeleton height="h-[360px]" />
            ) : (
              <LazyMount fallback={<ChartSkeleton height="h-[360px]" />}>
                <BarChart
                  chartId={chart.chartId}
                  title={chart.title}
                  data={
                    combinationChartDataByStatus[chart.status] ?? {
                      categories: [],
                      activeIpTypes: [],
                      groupedByIPAndYear: {},
                    }
                  }
                />
              </LazyMount>
            )}
          </div>
        ))}

        <div className="my-2 flex items-center space-x-3 lg:col-span-12">
          <span className="h-px flex-1 bg-gray-300" />

          <h2 className="text-xl font-semibold text-gray-700">
            Non-Grant Outcomes
          </h2>

          <span className="h-px flex-1 bg-gray-300" />
        </div>

        {TREND_CHARTS.slice(3).map((chart) => (
          <div key={chart.chartId} className={chart.colSpan}>
            {isLoading ? (
              <ChartSkeleton height="h-[360px]" />
            ) : (
              <LazyMount fallback={<ChartSkeleton height="h-[360px]" />}>
                <BarChart
                  chartId={chart.chartId}
                  title={chart.title}
                  data={
                    combinationChartDataByStatus[chart.status] ?? {
                      categories: [],
                      activeIpTypes: [],
                      groupedByIPAndYear: {},
                    }
                  }
                />
              </LazyMount>
            )}
          </div>
        ))}

        <div className="mt-2 border-t border-gray-100 pt-6 lg:col-span-12">
          {isLoading ? (
            <SummaryTableSkeleton />
          ) : (
            <LazyMount fallback={<SummaryTableSkeleton />}>
              <DashboardSummaryTable
                rows={summaryTableRows}
                totals={summaryTotals}
                yearFrom={filters.yearFrom}
                yearTo={filters.yearTo}
              />
            </LazyMount>
          )}
        </div>
      </div>
    </div>
  );
}
