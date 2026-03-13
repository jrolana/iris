"use client";

import { useEffect, useMemo, useState } from "react";
import PieChart from "@/components/charts/PieChart";
import CombinationChart from "@/components/charts/CombinationChart";
import DonutChart from "@/components/charts/DonutChart";
import DashboardSummaryTable from "@/components/dashboard/DashboardSummaryTable";
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
  TimelinePreset,
  getRangeFromPreset,
} from "@/lib/helper/dashboard-filters";
import {
  buildSummaryTableRows,
  buildSummaryTotals,
} from "@/lib/helper/dashboard-summary";
import {
  exportDashboardCsv,
  exportDashboardPdf,
} from "@/lib/helper/dashboard-export";

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardAnalytics();
  const currentYear = new Date().getFullYear();

  const [showExportMenu, setShowExportMenu] = useState(false);

  const sourceData = useMemo<DashboardAnalyticsType["Row"][]>(() => {
    return (data ?? []) as DashboardAnalyticsType["Row"][];
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

  const [filters, setFilters] = useState<DashboardFilters>({
    preset: "current_year",
    yearFrom: currentYear,
    yearTo: currentYear,
  });

  useEffect(() => {
    if (!availableYears.length) return;

    setFilters((prev) => {
      const range = getRangeFromPreset(
        prev.preset,
        minAvailableYear,
        maxAvailableYear,
        currentYear,
        prev,
      );

      return {
        ...prev,
        ...range,
      };
    });
  }, [availableYears, minAvailableYear, maxAvailableYear, currentYear]);

  const handlePresetChange = (preset: TimelinePreset) => {
    if (preset === "custom") {
      setFilters((prev) => ({
        ...prev,
        preset: "custom",
      }));
      return;
    }

    const range = getRangeFromPreset(
      preset,
      minAvailableYear,
      maxAvailableYear,
      currentYear,
      filters,
    );

    setFilters({
      preset,
      ...range,
    });
  };

  const handleCustomYearFromChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      preset: "custom",
      yearFrom: value,
      yearTo: value > prev.yearTo ? value : prev.yearTo,
    }));
  };

  const handleCustomYearToChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      preset: "custom",
      yearFrom: value < prev.yearFrom ? value : prev.yearFrom,
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

  const summaryTableRows = useMemo(
    () => buildSummaryTableRows(filteredData),
    [filteredData],
  );

  const summaryTotals = useMemo(
    () => buildSummaryTotals(summaryTableRows),
    [summaryTableRows],
  );

  const handleExportCsv = () => {
    exportDashboardCsv({
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      presetLabel: PRESET_LABELS[filters.preset],
      filteredData,
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
      presetLabel: PRESET_LABELS[filters.preset],
      chartExports: [
        { chartId: "dashboard-filed-pie", title: "Filed IPs" },
        { chartId: "dashboard-granted-pie", title: "Granted IPs" },
        { chartId: "dashboard-grant-rate-donut", title: "Grant Rate" },
        { chartId: "dashboard-filed-combo", title: "Filed Over Time" },
        { chartId: "dashboard-pending-combo", title: "Pending Over Time" },
        { chartId: "dashboard-granted-combo", title: "Granted Over Time" },
        { chartId: "dashboard-withdrawn-combo", title: "Withdrawn Over Time" },
        {
          chartId: "dashboard-downgraded-combo",
          title: "Downgraded Over Time",
        },
      ],
      summaryTableRows,
      summaryTotals,
      filteredData,
    });

    setShowExportMenu(false);
  };

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="mt-3 mb-2 text-2xl font-bold text-gray-700 lg:col-span-6">
          <h1>IP Portfolio at a Glance</h1>
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
                Report Timeline
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Apply one reporting range across all dashboard charts and
                exports.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  "current_year",
                  "all",
                  "last_3_years",
                  "last_5_years",
                  "custom",
                ] as TimelinePreset[]
              ).map((preset) => {
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
              <div className="min-w-[140px]">
                <label className="mb-1.5 block text-xs font-medium tracking-wide text-gray-500 uppercase">
                  From
                </label>
                <div className="relative">
                  <select
                    value={filters.yearFrom}
                    onChange={(e) =>
                      handleCustomYearFromChange(Number(e.target.value))
                    }
                    disabled={filters.preset !== "custom"}
                    className={cn(
                      "w-full appearance-none rounded-xl border px-3 py-2.5 pr-10 text-sm transition outline-none",
                      filters.preset === "custom"
                        ? "border-gray-300 bg-white text-gray-700 focus:border-brand-500"
                        : "border-gray-200 bg-gray-50 text-gray-400",
                    )}
                  >
                    {availableYears.map((year) => (
                      <option key={`from-${year}`} value={year}>
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

              <div className="min-w-[140px]">
                <label className="mb-1.5 block text-xs font-medium tracking-wide text-gray-500 uppercase">
                  To
                </label>
                <div className="relative">
                  <select
                    value={filters.yearTo}
                    onChange={(e) =>
                      handleCustomYearToChange(Number(e.target.value))
                    }
                    disabled={filters.preset !== "custom"}
                    className={cn(
                      "w-full appearance-none rounded-xl border px-3 py-2.5 pr-10 text-sm transition outline-none",
                      filters.preset === "custom"
                        ? "border-gray-300 bg-white text-gray-700 focus:border-brand-500"
                        : "border-gray-200 bg-gray-50 text-gray-400",
                    )}
                  >
                    {availableYears.map((year) => (
                      <option key={`to-${year}`} value={year}>
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
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium">Showing:</span> {filters.yearFrom}
                –{filters.yearTo}
              </div>
              <div className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium">Mode:</span>{" "}
                {PRESET_LABELS[filters.preset]}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row lg:col-span-7">
          <div className="md:w-[48%]">
            <PieChart
              chartId="dashboard-filed-pie"
              title="Filed IPs"
              subtitle={`Total filed IPs by type, ${filters.yearFrom}–${filters.yearTo}`}
              colors={ANALOGOUS_COLORS}
              dashboardStatus="filed"
              rawData={filteredData}
            />
          </div>

          <div className="md:w-[48%]">
            <PieChart
              chartId="dashboard-granted-pie"
              title="Granted IPs"
              subtitle={`Total granted IPs by type, ${filters.yearFrom}–${filters.yearTo}`}
              colors={ANALOGOUS_COLORS}
              dashboardStatus="granted"
              rawData={filteredData}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <DonutChart
            chartId="dashboard-grant-rate-donut"
            title="Granted IPs"
            subtitle="Grant rate of filed IPs"
            rawData={filteredData}
          />
        </div>

        <div className="my-6 text-2xl font-bold text-gray-700 lg:col-span-12">
          <h1>IP Journey: From Filing to Outcome</h1>
        </div>

        <div className="lg:col-span-6">
          <CombinationChart
            chartId="dashboard-filed-combo"
            title="Filed"
            rawData={filteredData}
            dashboardStatus="filed"
          />
        </div>

        <div className="lg:col-span-6">
          <CombinationChart
            chartId="dashboard-pending-combo"
            title="Pending"
            rawData={filteredData}
            dashboardStatus="pending"
          />
        </div>

        <div className="lg:col-span-12">
          <CombinationChart
            chartId="dashboard-granted-combo"
            title="Granted"
            rawData={filteredData}
            dashboardStatus="granted"
          />
        </div>

        <div className="my-6 flex items-center space-x-3 lg:col-span-12">
          <span className="h-px flex-1 bg-gray-300"></span>
          <h2 className="text-xl font-semibold text-gray-700">
            Alternative Outcomes
          </h2>
          <span className="h-px flex-1 bg-gray-300"></span>
        </div>

        <div className="lg:col-span-6">
          <CombinationChart
            chartId="dashboard-withdrawn-combo"
            title="Withdrawn"
            rawData={filteredData}
            dashboardStatus="withdrawn"
          />
        </div>

        <div className="lg:col-span-6">
          <CombinationChart
            chartId="dashboard-downgraded-combo"
            title="Downgraded"
            rawData={filteredData}
            dashboardStatus="downgraded"
          />
        </div>

        <div className="mt-2 lg:col-span-12">
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