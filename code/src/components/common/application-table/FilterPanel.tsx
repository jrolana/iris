import { useEffect, useState } from "react";
import { CollegeUnits, CollegeUnitType } from "@/lib/types/college-units";
import { IpStatuses, StatusType } from "@/lib/types/ip";
import { STATUS_LABELS } from "@/lib/helper/status-labels";

import Button from "../../ui/button/Button";
import { Input } from "../../ui/input";
import { MultiSelect } from "./MultiSelect";
import { TagInput } from "./TagInput";
import { Transition } from "@headlessui/react";

// Compile options once outside of component
const collegeOptions = Object.entries(CollegeUnits).map(([key, label]) => ({
  value: key,
  label: label,
}));

const allStatusTypes = [
  ...new Set(Object.values(IpStatuses).flat()),
] as StatusType[];

const statusOptions = allStatusTypes.map((status) => ({
  value: status,
  label: STATUS_LABELS[status] || status,
}));

const ipTypeOptions = [
  { value: "patent", label: "Patent" },
  { value: "utility_model", label: "Utility Model" },
  { value: "industrial_design", label: "Industrial Design" },
  { value: "trademark", label: "Trademark" },
  { value: "copyright", label: "Copyright" },
];

interface FilterPanelProps {
  isOpen: boolean;
  onApplyFilters: (filters: {
    title: string;
    statuses: StatusType | StatusType[] | undefined;
    colleges: CollegeUnitType[];
    techgens: string[];
    ip_types: string[];
  }) => void;
  onClose: () => void;
  currentFilters: {
    title: string;
    statuses: StatusType | StatusType[] | undefined;
    colleges: CollegeUnitType[];
    techgens: string[];
    ip_types: string[];
  };
}

export function FilterPanel({
  isOpen,
  onApplyFilters,
  onClose,
  currentFilters,
}: FilterPanelProps) {
  const [tempTitle, setTempTitle] = useState(currentFilters.title);
  const [tempStatuses, setTempStatuses] = useState<StatusType[]>(() => {
    if (!currentFilters.statuses) return [];
    return Array.isArray(currentFilters.statuses)
      ? currentFilters.statuses
      : [currentFilters.statuses];
  });
  const [tempColleges, setTempColleges] = useState<CollegeUnitType[]>(
    currentFilters.colleges,
  );
  const [tempTechgens, setTempTechgens] = useState<string[]>(
    currentFilters.techgens,
  );
  const [tempIpTypes, setTempIpTypes] = useState<string[]>(
    currentFilters.ip_types,
  );

  // Sync state if currentFilters props change
  useEffect(() => {
    const statusArray = Array.isArray(currentFilters.statuses)
      ? currentFilters.statuses
      : [currentFilters.statuses];

    setTempTitle(currentFilters.title);
    setTempStatuses(
      currentFilters.statuses ? (statusArray as StatusType[]) : [],
    );
    setTempColleges(currentFilters.colleges);
    setTempTechgens(currentFilters.techgens);
    setTempIpTypes(currentFilters.ip_types);
  }, [currentFilters]);

  const handleApply = () => {
    onApplyFilters({
      title: tempTitle,
      statuses: tempStatuses,
      colleges: tempColleges,
      techgens: tempTechgens,
      ip_types: tempIpTypes,
    });
    onClose();
  };

  const handleClear = () => {
    setTempTitle("");
    setTempStatuses([]);
    setTempColleges([]);
    setTempTechgens([]);
    setTempIpTypes([]);
  };

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity transition-transform duration-200 ease-out"
      enterFrom="opacity-0 translate-y-[-10px]"
      enterTo="opacity-100 translate-y-0"
      leave="transition-opacity transition-transform duration-150 ease-in"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-[-10px]"
    >
      <div className="mb-6 flex flex-col gap-6 rounded-xl border border-gray-100 bg-gray-50 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Title, IP Types, and Techgens */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">
                IP/Project Title
              </p>
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Search by title..."
                className="bg-white text-sm font-normal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">IP Type</p>
              <MultiSelect
                options={ipTypeOptions}
                selected={tempIpTypes}
                onChange={setTempIpTypes as (selected: string[]) => void}
                placeholder="Select IP types..."
                className="bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">
                Technology Generators
              </p>
              <TagInput
                tags={tempTechgens}
                onChange={setTempTechgens}
                placeholder="Add techgen name..."
              />
            </div>
          </div>

          {/* Colleges and Status */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">Colleges</p>
              <MultiSelect
                options={collegeOptions}
                selected={tempColleges}
                onChange={setTempColleges as (selected: string[]) => void}
                placeholder="Select colleges..."
                className="bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">Status</p>
              <MultiSelect
                options={statusOptions}
                selected={tempStatuses}
                onChange={setTempStatuses as (selected: string[]) => void}
                placeholder="Select status..."
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="xsm:items-center xsm:flex-row flex flex-col-reverse items-start justify-end gap-3 border-t border-gray-100 pt-4">
          <Button
            variant="ghost"
            onClick={handleClear}
            className="h-10 py-2 text-gray-500"
          >
            Clear Filters
          </Button>
          <Button variant="outline" onClick={onClose} className="h-10 py-2">
            Cancel
          </Button>
          <Button onClick={handleApply} className="h-10 py-2">
            Apply Filters
          </Button>
        </div>
      </div>
    </Transition>
  );
}
