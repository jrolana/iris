"use client";

import { useEffect, useMemo, useState } from "react";
import PieChart from "@/components/charts/PieChart";
import CombinationChart from "@/components/charts/CombinationChart";
import DonutChart from "@/components/charts/DonutChart";
import DashboardSummaryTable from "@/components/dashboard/DashboardSummaryTable";
import OverviewKPIs from "../dashboard/OverviewKPIs";
import Button from "@/components/ui/button/Button";
import { CiExport } from "react-icons/ci";
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
  IP_TYPE_ORDER,
  STATUS_ORDER,
} from "@/lib/dashboard/dashboard-summary";
import {
  exportDashboardCsv,
  exportDashboardPdf,
} from "@/lib/dashboard/dashboard-export";
import {
  PIE_CHARTS,
  TREND_CHARTS,
  PDF_EXPORT_CHARTS,
} from "@/lib/dashboard/dashboard";

type YearSelectProps = {
  label: string;
  value: number;
  years: number[];
  disabled: boolean;
  onChange: (value: number) => void;
};

type DashboardStatus = DashboardAnalyticsType["dashboard_status"];

type PieChartDatum = {
  ipType: string;
  total: number;
};

type CombinationChartData = {
  categories: number[];
  activeIpTypes: string[];
  groupedByIPAndYear: Record<string, Record<number, number>>;
  actualTotalSeries: number[];
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

function YearSelect({
  label,
  value,
  years,
  disabled,
  onChange,
}: YearSelectProps) {
  return (
    <div className="min-w-[140px]">
      <label className="mb-1.5 block text-xs font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-xl border px-3 py-2.5 pr-10 text-sm transition outline-none",
            disabled
              ? "border-gray-200 bg-gray-50 text-gray-400"
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

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardAnalytics();
  const currentYear = new Date().getFullYear();

  const [showExportMenu, setShowExportMenu] = useState(false);

  const [filters, setFilters] = useState<DashboardFilters>({
    preset: "current_year",
    yearFrom: currentYear,
    yearTo: currentYear,
  });

  const sourceData = useMemo<DashboardAnalyticsType[]>(() => {
    return ((data ?? []) as DashboardAnalyticsType[]).sort(
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

    for (const status of STATUS_ORDER) {
      if (!status) continue;

      const rows = filteredData.filter(
        (item) =>
          !!item &&
          item.dashboard_status === status &&
          !!item.ip_type &&
          item.year !== null,
      );

      const categories = Array.from(
        new Set(rows.map((item) => Number(item.year))),
      ).sort((a, b) => a - b);

      const groupedByIPAndYear = rows.reduce<
        Record<string, Record<number, number>>
      >((acc, item) => {
        const ipType = item.ip_type!;
        const year = Number(item.year);

        if (!acc[ipType]) {
          acc[ipType] = {};
        }

        acc[ipType][year] = Number(item.total ?? 0);
        return acc;
      }, {});

      const activeIpTypes = IP_TYPE_ORDER.filter(
        (ipType) => groupedByIPAndYear[ipType],
      );

      const actualTotalSeries = categories.map((year) =>
        Object.values(groupedByIPAndYear).reduce(
          (sum, totalsByYear) => sum + (totalsByYear[year] ?? 0),
          0,
        ),
      );

      result[status] = {
        categories,
        activeIpTypes,
        groupedByIPAndYear,
        actualTotalSeries,
      };
    }

    return result;
  }, [filteredData]);

  const grantRateMetrics = useMemo<DonutMetrics>(() => {
    const validRows = filteredData.filter(
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

    const computeTotalsAndRate = (rows: DashboardAnalyticsType[]) => {
      const numerator = rows
        .filter((item) => item.dashboard_status === "granted")
        .reduce((sum, item) => sum + Number(item.total ?? 0), 0);

      const denominator = rows
        .filter((item) => item.dashboard_status === "filed")
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
  }, [filteredData]);

  const summaryTableRows = useMemo(
    () => buildSummaryTableRows(filteredData),
    [filteredData],
  );

  const summaryTotals = useMemo(
    () => buildSummaryTotals(summaryTableRows),
    [summaryTableRows],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const pieSubtitle = `By IP type, ${filters.yearFrom}–${filters.yearTo}`;

  const handleExportCsv = () => {
    exportDashboardCsv({
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      summaryTableRows,
      summaryTotals,
    });
    setShowExportMenu(false);
  };

  const handleExportPdf = async () => {
    await exportDashboardPdf({
      filename: `ip-portfolio-${filters.yearFrom}-${filters.yearTo}.pdf`,
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      chartExports: PDF_EXPORT_CHARTS,
      summaryTableRows,
      summaryTotals,
    });

    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="mt-3 mb-2 lg:col-span-6">
          <h1 className="text-2xl font-bold text-gray-700">
            IP Portfolio Overview
          </h1>
        </div>

        <div className="relative mt-3 mb-2 flex justify-end lg:col-span-6">
          <Button
            startIcon={<CiExport size="18" />}
            onClick={() => setShowExportMenu((prev) => !prev)}
          >
            Export
          </Button>

          {showExportMenu && (
            <div className="absolute top-12 right-0 z-20 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              <button
                type="button"
                onClick={handleExportCsv}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Export CSV
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Export PDF
              </button>
            </div>
          )}
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <YearSelect
                label="From"
                value={filters.yearFrom}
                years={availableYears}
                disabled={filters.preset !== "custom"}
                onChange={handleCustomYearFromChange}
              />

              <YearSelect
                label="To"
                value={filters.yearTo}
                years={availableYears}
                disabled={filters.preset !== "custom"}
                onChange={handleCustomYearToChange}
              />
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
            </div>
          </div>
        </div>

        <div className="pt-2 lg:col-span-12">
          <h2 className="text-xl font-semibold text-gray-800">
            Portfolio Status Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View status distribution and grant rate for the selected years.
          </p>
        </div>

        <div className="lg:col-span-12">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <DonutChart
                chartId="dashboard-grant-rate-donut"
                title="Grant Rate"
                subtitle={`Percent of filed applications that were granted, ${filters.yearFrom}–${filters.yearTo}`}
                metrics={grantRateMetrics}
              />
            </div>

            <div className="lg:col-span-6">
              <OverviewKPIs
                rawData={filteredData}
                yearFrom={filters.yearFrom}
                yearTo={filters.yearTo}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {PIE_CHARTS.slice(0, 2).map((chart) => (
              <PieChart
                key={chart.chartId}
                chartId={chart.chartId}
                title={chart.title}
                subtitle={pieSubtitle}
                colors={ANALOGOUS_COLORS}
                data={pieChartDataByStatus[chart.status] ?? []}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PIE_CHARTS.slice(2).map((chart) => (
              <PieChart
                key={chart.chartId}
                chartId={chart.chartId}
                title={chart.title}
                subtitle={pieSubtitle}
                colors={ANALOGOUS_COLORS}
                data={pieChartDataByStatus[chart.status] ?? []}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 lg:col-span-12">
          <h2 className="text-2xl font-bold text-gray-700">
            Application Trends by Status
          </h2>
        </div>

        {TREND_CHARTS.slice(0, 3).map((chart) => (
          <div key={chart.chartId} className={chart.colSpan}>
            <CombinationChart
              chartId={chart.chartId}
              title={chart.title}
              data={
                combinationChartDataByStatus[chart.status] ?? {
                  categories: [],
                  activeIpTypes: [],
                  groupedByIPAndYear: {},
                  actualTotalSeries: [],
                }
              }
            />
          </div>
        ))}

        <div className="my-2 flex items-center space-x-3 lg:col-span-12">
          <span className="h-px flex-1 bg-gray-300"></span>
          <h2 className="text-xl font-semibold text-gray-700">
            Non-Grant Outcomes
          </h2>
          <span className="h-px flex-1 bg-gray-300"></span>
        </div>

        {TREND_CHARTS.slice(3).map((chart) => (
          <div key={chart.chartId} className={chart.colSpan}>
            <CombinationChart
              chartId={chart.chartId}
              title={chart.title}
              data={
                combinationChartDataByStatus[chart.status] ?? {
                  categories: [],
                  activeIpTypes: [],
                  groupedByIPAndYear: {},
                  actualTotalSeries: [],
                }
              }
            />
          </div>
        ))}

        <div className="mt-2 border-t border-gray-100 pt-6 lg:col-span-12">
          <DashboardSummaryTable
            rows={summaryTableRows}
            totals={summaryTotals}
            yearFrom={filters.yearFrom}
            yearTo={filters.yearTo}
          />
        </div>
      </div>
    </div>
  );
}
