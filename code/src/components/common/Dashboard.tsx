"use client";

import { useEffect, useMemo, useState } from "react";
import PieChart from "@/components/charts/PieChart";
import CombinationChart from "@/components/charts/CombinationChart";
import DonutChart from "@/components/charts/DonutChart";
import Button from "@/components/ui/button/Button";
import { CiExport } from "react-icons/ci";
import { ANALOGOUS_COLORS } from "@/lib/constants/ui";
import { useGetDashboardAnalytics } from "@/hooks/views/useGetDashboardAnalytics";
import { START_YEAR } from "@/lib/constants/dashboard_analytics";
import { cn } from "@/lib/utils";

type TimelinePreset =
  | "current_year"
  | "all"
  | "last_3_years"
  | "last_5_years"
  | "custom";

type DashboardFilters = {
  preset: TimelinePreset;
  yearFrom: number;
  yearTo: number;
};

const PRESET_LABELS: Record<TimelinePreset, string> = {
  current_year: "Current Year",
  all: "All Years",
  last_3_years: "Last 3 Years",
  last_5_years: "Last 5 Years",
  custom: "Custom Range",
};

const getRangeFromPreset = (
  preset: TimelinePreset,
  minYear: number,
  maxYear: number,
  currentYear: number,
  prev?: DashboardFilters,
): Pick<DashboardFilters, "yearFrom" | "yearTo"> => {
  if (preset === "current_year") {
    const safeCurrentYear =
      currentYear >= minYear && currentYear <= maxYear
        ? currentYear
        : maxYear;

    return {
      yearFrom: safeCurrentYear,
      yearTo: safeCurrentYear,
    };
  }

  if (preset === "all") {
    return {
      yearFrom: minYear,
      yearTo: maxYear,
    };
  }

  if (preset === "last_3_years") {
    return {
      yearFrom: Math.max(maxYear - 2, minYear),
      yearTo: maxYear,
    };
  }

  if (preset === "last_5_years") {
    return {
      yearFrom: Math.max(maxYear - 4, minYear),
      yearTo: maxYear,
    };
  }

  return {
    yearFrom: Math.max(prev?.yearFrom ?? currentYear, minYear),
    yearTo: Math.min(prev?.yearTo ?? currentYear, maxYear),
  };
};

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardAnalytics();
  const currentYear = new Date().getFullYear();

  const availableYears = useMemo(() => {
    const years =
      data
        ?.map((item) => item.year)
        .filter((year): year is number => year !== null)
        .map(Number)
        .sort((a, b) => a - b) ?? [];

    return Array.from(new Set(years));
  }, [data]);

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
    if (!data) return [];

    return data.filter((item) => {
      if (item.year === null) return false;
      const year = Number(item.year);
      return year >= filters.yearFrom && year <= filters.yearTo;
    });
  }, [data, filters.yearFrom, filters.yearTo]);

  const backendQueryFilters = useMemo(
    () => ({
      preset: filters.preset,
      year_from: filters.yearFrom,
      year_to: filters.yearTo,
    }),
    [filters.preset, filters.yearFrom, filters.yearTo],
  );

  const handleExport = () => {
    console.log("Export dashboard report", {
      filters: backendQueryFilters,
      rowCount: filteredData.length,
      exportedAt: new Date().toISOString(),
    });
  };

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
      <div className="mt-3 mb-2 text-2xl font-bold text-gray-700 lg:col-span-6">
        <h1>IP Portfolio at a Glance</h1>
      </div>

      <div className="mt-3 mb-2 flex justify-end lg:col-span-6">
        <Button startIcon={<CiExport size="18" />} onClick={handleExport}>
          Export Reports
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-12">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-800">
              Report Timeline
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Apply one reporting range across all dashboard charts and exports.
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
              <select
                value={filters.yearFrom}
                onChange={(e) =>
                  handleCustomYearFromChange(Number(e.target.value))
                }
                disabled={filters.preset !== "custom"}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-sm transition outline-none",
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
            </div>

            <div className="min-w-[140px]">
              <label className="mb-1.5 block text-xs font-medium tracking-wide text-gray-500 uppercase">
                To
              </label>
              <select
                value={filters.yearTo}
                onChange={(e) =>
                  handleCustomYearToChange(Number(e.target.value))
                }
                disabled={filters.preset !== "custom"}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-sm transition outline-none",
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
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700">
              <span className="font-medium">Showing:</span> {filters.yearFrom}–{filters.yearTo}
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700">
              <span className="font-medium">Mode:</span> {PRESET_LABELS[filters.preset]}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 md:flex-row lg:col-span-7">
        <div className="md:w-[48%]">
          <PieChart
            title="Filed IPs"
            subtitle={`Total filed IPs by type, ${filters.yearFrom}–${filters.yearTo}`}
            colors={ANALOGOUS_COLORS}
            dashboardStatus="filed"
            rawData={filteredData}
          />
        </div>

        <div className="md:w-[48%]">
          <PieChart
            title="Granted IPs"
            subtitle={`Total granted IPs by type, ${filters.yearFrom}–${filters.yearTo}`}
            colors={ANALOGOUS_COLORS}
            dashboardStatus="granted"
            rawData={filteredData}
          />
        </div>
      </div>

      <div className="lg:col-span-5">
        {/* <DonutChart title="Granted IPs" rawData={filteredData} /> */}
      </div>

      <div className="my-6 text-2xl font-bold text-gray-700 lg:col-span-12">
        <h1>IP Journey: From Filing to Outcome</h1>
      </div>

      <div className="lg:col-span-6">
        <CombinationChart title="Filed" rawData={filteredData} dashboardStatus="filed" />
      </div>

      <div className="lg:col-span-6">
        <CombinationChart title="Pending" rawData={filteredData} dashboardStatus="pending" />
      </div>

      <div className="lg:col-span-12">
        <CombinationChart title="Granted" rawData={filteredData} dashboardStatus="granted" />
      </div>

      <div className="my-6 flex items-center space-x-3 lg:col-span-12">
        <span className="h-px flex-1 bg-gray-300"></span>
        <h2 className="text-xl font-semibold text-gray-700">Alternative Outcomes</h2>
        <span className="h-px flex-1 bg-gray-300"></span>
      </div>

      <div className="lg:col-span-6">
        <CombinationChart title="Withdrawn" rawData={filteredData} dashboardStatus="withdrawn" />
      </div>

      <div className="lg:col-span-6">
        <CombinationChart title="Downgraded" rawData={filteredData} dashboardStatus="downgraded" />
      </div>
    </div>
  );
}