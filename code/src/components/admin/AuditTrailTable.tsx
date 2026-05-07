"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { Input } from "../ui/input";
import { MultiSelect } from "./filter/MultiSelect";
import {
  ActionCategory,
  ActionResult,
  AuditLogType,
  RecordType,
  mapAuditTrailRow,
} from "@/lib/types/audit_trail";
import { StatusBadge } from "../common/StatusBadge";
import {
  ActionCategoryBadgeClasses,
  ActionResultBadgeClasses,
} from "@/lib/constants/ui";
import { useGetAuditTrail } from "@/hooks/audit-trail/useGetAuditTrail";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  FilterIcon,
  Loader,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

const actionCategoryOptions = Object.values(ActionCategory).map((value) => ({
  value,
  label: value,
}));

const actionResultOptions = Object.values(ActionResult).map((value) => ({
  value,
  label: value,
}));

const recordTypeOptions = Object.values(RecordType).map((value) => ({
  value,
  label: value,
}));

type AuditSortField =
  | "timestamp"
  | "userName"
  | "userRole"
  | "actionCategory"
  | "actionResult"
  | "recordType"
  | "recordReference";

export default function AuditTrailTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const { data, isLoading, isFetching } = useGetAuditTrail();
  const records = data.map(mapAuditTrailRow);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<AuditSortField>("timestamp");
  const [isAscendingSort, setIsAscendingSort] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedActionCategories, setSelectedActionCategories] = useState<
    ActionCategory[]
  >([]);
  const [selectedActionResults, setSelectedActionResults] = useState<
    ActionResult[]
  >([]);
  const [selectedRecordTypes, setSelectedRecordTypes] = useState<RecordType[]>(
    [],
  );

  const roleOptions = [...new Set(records.map((record) => record.userRole))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({
      value,
      label: value,
    }));

  const sortOptions: { value: AuditSortField; label: string }[] = [
    { value: "timestamp", label: "Timestamp" },
    { value: "userName", label: "User Name" },
    { value: "userRole", label: "User Role" },
    { value: "actionCategory", label: "Action Category" },
    { value: "actionResult", label: "Action Result" },
    { value: "recordType", label: "Record Type" },
    { value: "recordReference", label: "Record Reference" },
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      [
        record.userName,
        record.userRole,
        record.actionTaken,
        record.recordReference,
        record.recordType,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));

    const matchesRole =
      selectedRoles.length === 0 || selectedRoles.includes(record.userRole);
    const matchesActionCategory =
      selectedActionCategories.length === 0 ||
      selectedActionCategories.includes(record.actionCategory);
    const matchesActionResult =
      selectedActionResults.length === 0 ||
      selectedActionResults.includes(record.actionResult);
    const matchesRecordType =
      selectedRecordTypes.length === 0 ||
      selectedRecordTypes.includes(record.recordType);

    return (
      matchesSearch &&
      matchesRole &&
      matchesActionCategory &&
      matchesActionResult &&
      matchesRecordType
    );
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortBy === "timestamp") {
      const left = new Date(a.timestamp).getTime();
      const right = new Date(b.timestamp).getTime();
      return isAscendingSort ? left - right : right - left;
    }

    const left = String(a[sortBy] ?? "").toLowerCase();
    const right = String(b[sortBy] ?? "").toLowerCase();
    const result = left.localeCompare(right);

    return isAscendingSort ? result : -result;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    sortBy,
    isAscendingSort,
    selectedRoles,
    selectedActionCategories,
    selectedActionResults,
    selectedRecordTypes,
  ]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(sortedRecords.length / recordsPerPage),
  );

  const tableHeaders = [
    "Timestamp",
    "User Name",
    "User Role",
    "Action Category",
    "Action Taken",
    "Action Result",
    "Record Type",
    "Record Reference",
  ];

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedRoles.length > 0 ||
    selectedActionCategories.length > 0 ||
    selectedActionResults.length > 0 ||
    selectedRecordTypes.length > 0;

  function clearAllFilters() {
    setSearchQuery("");
    setSelectedRoles([]);
    setSelectedActionCategories([]);
    setSelectedActionResults([]);
    setSelectedRecordTypes([]);
    setCurrentPage(1);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Audit Trail</h1>
          {isFetching && !isLoading ? (
            <p className="mt-1 text-sm text-slate-500">Refreshing audit entries...</p>
          ) : null}
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search user, role, action, or record..."
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Popover open={isSortPanelOpen} onOpenChange={setIsSortPanelOpen}>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "data-[empty=true]:text-muted-foreground m-0 flex h-10 w-fit justify-start px-3 py-2 text-left text-sm font-medium text-gray-700",
              )}
              disabled={isLoading}
            >
              {sortOptions.find((option) => option.value === sortBy)?.label ??
                "Sort By"}
            </PopoverTrigger>
            <PopoverContent
              className="max-h-[300px] w-[calc(100vw-2rem)] overflow-y-auto p-2 sm:w-56"
              align="end"
              collisionPadding={16}
            >
              <div className="flex flex-col gap-1">
                <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold tracking-wider uppercase">
                  Sort Options
                </div>

                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortPanelOpen(false);
                    }}
                    className="flex w-full items-center justify-start rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <button
            onClick={() => setIsAscendingSort((current) => !current)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-muted-foreground hover:text-foreground flex h-auto w-auto shrink-0 items-center justify-center p-0 hover:bg-transparent",
            )}
            aria-label={
              isAscendingSort ? "Sort descending" : "Sort ascending"
            }
            disabled={isLoading}
          >
            {isAscendingSort ? (
              <ArrowDownNarrowWide className="h-6! w-6!" />
            ) : (
              <ArrowUpNarrowWide className="h-6! w-6!" />
            )}
          </button>

          <Button
            variant="outline"
            size="sm"
            startIcon={<FilterIcon size={18} />}
            onClick={() => setIsFilterPanelOpen((value) => !value)}
            className="h-10 max-w-fit"
            disabled={isLoading}
          >
            {isFilterPanelOpen ? "Close Filters" : "Filter"}
          </Button>
        </div>
      </div>

      {isFilterPanelOpen ? (
        <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">User Roles</p>
              <MultiSelect
                options={roleOptions}
                selected={selectedRoles}
                onChange={setSelectedRoles}
                placeholder="Select roles..."
                className="bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">
                Action Category
              </p>
              <MultiSelect
                options={actionCategoryOptions}
                selected={selectedActionCategories}
                onChange={(selected) =>
                  setSelectedActionCategories(selected as ActionCategory[])
                }
                placeholder="Select action categories..."
                className="bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">Action Result</p>
              <MultiSelect
                options={actionResultOptions}
                selected={selectedActionResults}
                onChange={(selected) =>
                  setSelectedActionResults(selected as ActionResult[])
                }
                placeholder="Select action results..."
                className="bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-gray-700">Record Type</p>
              <MultiSelect
                options={recordTypeOptions}
                selected={selectedRecordTypes}
                onChange={(selected) =>
                  setSelectedRecordTypes(selected as RecordType[])
                }
                placeholder="Select record types..."
                className="bg-white"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      ) : null}

      {hasActiveFilters ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {searchQuery.trim() ? (
            <Badge variant="neutral" size="sm" className="group hover:bg-gray-100">
              Search: "{searchQuery.trim()}"
              <button
                className="ml-1.5 opacity-60 group-hover:opacity-100"
                onClick={() => setSearchQuery("")}
              >
                <X size={14} />
              </button>
            </Badge>
          ) : null}

          {selectedRoles.map((role) => (
            <Badge
              key={`role-${role}`}
              variant="neutral"
              size="sm"
              className="group hover:bg-gray-100"
            >
              Role: {role}
              <button
                className="ml-1.5 opacity-60 group-hover:opacity-100"
                onClick={() =>
                  setSelectedRoles((current) =>
                    current.filter((value) => value !== role),
                  )
                }
              >
                <X size={14} />
              </button>
            </Badge>
          ))}

          {selectedActionCategories.map((category) => (
            <Badge
              key={`action-category-${category}`}
              variant="neutral"
              size="sm"
              className="group hover:bg-gray-100"
            >
              Action: {category}
              <button
                className="ml-1.5 opacity-60 group-hover:opacity-100"
                onClick={() =>
                  setSelectedActionCategories((current) =>
                    current.filter((value) => value !== category),
                  )
                }
              >
                <X size={14} />
              </button>
            </Badge>
          ))}

          {selectedActionResults.map((result) => (
            <Badge
              key={`action-result-${result}`}
              variant="neutral"
              size="sm"
              className="group hover:bg-gray-100"
            >
              Result: {result}
              <button
                className="ml-1.5 opacity-60 group-hover:opacity-100"
                onClick={() =>
                  setSelectedActionResults((current) =>
                    current.filter((value) => value !== result),
                  )
                }
              >
                <X size={14} />
              </button>
            </Badge>
          ))}

          {selectedRecordTypes.map((recordType) => (
            <Badge
              key={`record-type-${recordType}`}
              variant="neutral"
              size="sm"
              className="group hover:bg-gray-100"
            >
              Record: {recordType}
              <button
                className="ml-1.5 opacity-60 group-hover:opacity-100"
                onClick={() =>
                  setSelectedRecordTypes((current) =>
                    current.filter((value) => value !== recordType),
                  )
                }
              >
                <X size={14} />
              </button>
            </Badge>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="text-theme-xs ml-1 h-auto text-gray-500 hover:bg-gray-100"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
            <Loader className="h-4 w-4 animate-spin" />
            Loading audit trail...
          </div>
        ) : currentRecords.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
            {hasActiveFilters
              ? "No audit entries match the current filters."
              : "No audit entries yet."}
          </div>
        ) : (
          <Table>
            <TableHeader className="border-y border-gray-100">
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="text-theme-xs p-2 py-3 text-start font-medium text-gray-500"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {currentRecords.map((record: AuditLogType) => (
                <TableRow key={record.id}>
                  <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                    {new Date(record.timestamp).toLocaleDateString([], {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                    {record.userName}
                  </TableCell>
                  <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                    {record.userRole}
                  </TableCell>

                  <TableCell className="p-2 py-3">
                    <StatusBadge
                      label={record.actionCategory}
                      className={
                        ActionCategoryBadgeClasses[record.actionCategory]
                      }
                    />
                  </TableCell>

                  <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                    {record.actionTaken}
                  </TableCell>

                  <TableCell className="p-2 py-3">
                    <StatusBadge
                      label={record.actionResult}
                      className={ActionResultBadgeClasses[record.actionResult]}
                    />
                  </TableCell>

                  <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                    {record.recordType}
                  </TableCell>
                  <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                    {record.recordReference}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <hr className="border border-gray-100"></hr>

      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "primary" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
