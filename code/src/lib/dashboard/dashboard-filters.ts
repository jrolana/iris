export type TimelinePreset =
  | "current_year"
  | "all"
  | "last_3_years"
  | "last_5_years"
  | "custom";

export const TIMELINE_PRESETS: TimelinePreset[] = [
  "current_year",
  "all",
  "last_3_years",
  "last_5_years",
  "custom",
];

export type DashboardFilters = {
  preset: TimelinePreset;
  yearFrom: number;
  yearTo: number;
};

export const PRESET_LABELS: Record<TimelinePreset, string> = {
  current_year: "Current Year",
  all: "All Years",
  last_3_years: "Last 3 Years",
  last_5_years: "Last 5 Years",
  custom: "Custom Range",
};

export const getRangeFromPreset = (
  preset: TimelinePreset,
  minYear: number,
  maxYear: number,
  currentYear: number,
  prev?: DashboardFilters,
): Pick<DashboardFilters, "yearFrom" | "yearTo"> => {
  if (preset === "current_year") {
    const safeCurrentYear =
      currentYear >= minYear && currentYear <= maxYear ? currentYear : maxYear;

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