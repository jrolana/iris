import { CollegeUnits, CollegeUnitType } from "@/lib/types/college-units";
import { StatusType } from "@/lib/types/ip";
import { STATUS_LABELS } from "@/lib/helper/status-labels";

import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  title?: string;
  statuses?: StatusType | StatusType[];
  colleges?: CollegeUnitType[];
  techgens?: string[];
  ip_types?: string[];
  onRemove: (type: string, value: string) => void;
  onClearAll: () => void;
}

interface FilterPillType {
  type: string;
  value: string;
  label: string;
}

export function ActiveFilters(props: ActiveFiltersProps) {
  const {
    title,
    statuses,
    colleges,
    techgens,
    ip_types,
    onRemove,
    onClearAll,
  } = props;
  const allFilters: FilterPillType[] = [];

  // Title filter
  if (title) {
    allFilters.push({
      type: "title",
      value: title,
      label: `Title: "${title}"`,
    });
  }
  // IP Type filter
  const ipTypesInArray = Array.isArray(ip_types) ? ip_types : [ip_types];
  const ipTypesArray = ip_types ? ipTypesInArray : [];
  ipTypesArray.forEach((ip_type) => {
    allFilters.push({
      type: "ip_type",
      value: ip_type ?? "",
      label: `IP Type: "${ip_type}"`,
    });
  });

  // Status filters
  const statusInArray = Array.isArray(statuses) ? statuses : [statuses];
  const statusesArray = statuses ? statusInArray : [];
  statusesArray.forEach((s) => {
    allFilters.push({
      type: "status",
      value: s!,
      label: `Status: ${STATUS_LABELS[s! as StatusType] || s!}`,
    });
  });

  // College filters
  colleges?.forEach((c) => {
    allFilters.push({
      type: "college",
      value: c,
      label: `College: ${CollegeUnits[c]}`,
    });
  });

  // Techgens filters
  techgens?.forEach((t) => {
    allFilters.push({
      type: "techgen",
      value: t,
      label: `Techgen: ${t}`,
    });
  });

  // Render nothing if there are no filters
  if (allFilters.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {allFilters.map((filter) => (
        <Badge
          key={`${filter.type}-${filter.value}`}
          variant="neutral"
          size="sm"
          className="group hover:bg-gray-100"
        >
          {filter.label}
          <button
            className="ml-1.5 opacity-60 group-hover:opacity-100"
            onClick={() => onRemove(filter.type, filter.value)}
          >
            <X size={14} />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="text-theme-xs ml-1 h-auto text-gray-500 hover:bg-gray-100"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  );
}
