import { useEffect, useState } from "react";
import { CollegeUnits, CollegeUnitType } from "@/lib/types/college-units";

import Button from "../../ui/button/Button";
import { Input } from "../../ui/input";
import { MultiSelect } from "./MultiSelect";
import { Transition } from "@headlessui/react";
import { RoleType } from "@/lib/types/role";
import { ROLE_OPTIONS } from "@/lib/constants/roles";

// Compile options once outside of component
const collegeOptions = Object.entries(CollegeUnits).map(([key, label]) => ({
  value: key,
  label: label,
}));

const statusOptions: { value: RequestStatusType; label: string }[] = [
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "pending", label: "Pending" },
];

interface FilterPanelProps {
  isOpen: boolean;
  isForUserRequests?: boolean; // If true, show status filter
  onApplyFilters: (filters: {
    nameEmail: string;
    statuses: RequestStatusType[];
    colleges: CollegeUnitType[];
    roles: RoleType[];
  }) => void;
  onClose: () => void;
  currentFilters: {
    nameEmail: string;
    statuses: RequestStatusType[];
    colleges: CollegeUnitType[];
    roles: RoleType[];
  };
}

type RequestStatusType = "approved" | "rejected" | "pending";

export function FilterPanel({
  isOpen,
  onApplyFilters,
  onClose,
  currentFilters,
  isForUserRequests = false,
}: FilterPanelProps) {
  const [tempNameEmail, setTempNameEmail] = useState(currentFilters.nameEmail);
  const [tempStatuses, setTempStatuses] = useState<RequestStatusType[]>(
    currentFilters.statuses,
  );
  const [tempColleges, setTempColleges] = useState<CollegeUnitType[]>(
    currentFilters.colleges,
  );
  const [tempRoles, setTempRoles] = useState<RoleType[]>(currentFilters.roles);

  // Sync state if currentFilters props change
  useEffect(() => {
    setTempNameEmail(currentFilters.nameEmail);
    setTempStatuses(currentFilters.statuses);
    setTempColleges(currentFilters.colleges);
    setTempRoles(currentFilters.roles);
  }, [currentFilters]);

  const handleApply = () => {
    onApplyFilters({
      nameEmail: tempNameEmail,
      statuses: tempStatuses,
      colleges: tempColleges,
      roles: tempRoles,
    });
    onClose();
  };

  const handleClear = () => {
    setTempNameEmail("");
    setTempStatuses([]);
    setTempColleges([]);
    setTempRoles([]);
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
          {/* Name/Email */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">Name/Email</p>
              <Input
                value={tempNameEmail}
                onChange={(e) => setTempNameEmail(e.target.value)}
                placeholder="Search by name or email..."
                className="bg-white text-sm font-normal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">Roles</p>
              <MultiSelect
                options={ROLE_OPTIONS}
                selected={tempRoles}
                onChange={setTempRoles as (selected: string[]) => void}
                placeholder="Select Roles..."
                className="bg-white"
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
            {isForUserRequests && (
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
            )}
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
