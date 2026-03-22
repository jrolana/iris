import { CollegeUnits, CollegeUnitType } from "@/lib/types/college-units";

import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  name_email?: string;
  roles?: string[];
  colleges?: CollegeUnitType[];
  status?: ("approved" | "rejected" | "pending")[];
  onRemove: (type: string, value: string) => void;
  onClearAll: () => void;
}

interface FilterPillType {
  type: string;
  value: string;
  label: string;
}

export function ActiveFilters(props: ActiveFiltersProps) {
  const { name_email, roles, colleges, status, onRemove, onClearAll } = props;
  const allFilters: FilterPillType[] = [];

  // Name/Email filter
  if (name_email) {
    allFilters.push({
      type: "name_email",
      value: name_email,
      label: `Name/Email: "${name_email}"`,
    });
  }

  // College filters
  colleges?.forEach((c) => {
    allFilters.push({
      type: "college",
      value: c,
      label: `College: ${CollegeUnits[c]}`,
    });
  });

  // Role filters
  roles?.forEach((r) => {
    allFilters.push({
      type: "role",
      value: r,
      label: `Role: ${r}`,
    });
  });

  // Status filter
  status?.forEach((s) => {
    allFilters.push({
      type: "status",
      value: s,
      label: `Status: ${s}`,
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
