"use client";

import { useEffect, useState } from "react";
import { useApplicationsGetApplicationsByQuery } from "@/hooks/applications/useGetApplicationsByQuery";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { formatDate } from "@/lib/helper/format-date";
import { IpType, StatusType } from "@/lib/types/ip";
import { CollegeUnitType } from "@/lib/types/college-units";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PencilIcon, TrashBinIcon, PlusIcon, EyeIcon } from "@/icons/index";
import Badge, { BadgeProps } from "../ui/badge/Badge";
import Link from "next/link";
import Button from "../ui/button/Button";
import { FilterPanel } from "./application-table/FilterPanel";
import { ActiveFilters } from "./application-table/ActiveFilters";
import { FilterIcon, Loader, ArrowUpDown, X } from "lucide-react";
import { Application, sortApplications } from "@/lib/helper/sort-applications";

interface PropsInterface {
  isAdmin?: boolean;
  isTechgen?: boolean;
}

const sortOptions = [
  { value: "ip_title-asc", label: "IP Title (A-Z)" },
  { value: "ip_title-desc", label: "IP Title (Z-A)" },
  { value: "filing_date-asc", label: "Filing Date (Oldest)" },
  { value: "filing_date-desc", label: "Filing Date (Newest)" },
  { value: "registration_date-asc", label: "Registration Date (Oldest)" },
  { value: "registration_date-desc", label: "Registration Date (Newest)" },
  { value: "created_at-asc", label: "Date Added (Oldest)" },
  { value: "created_at-desc", label: "Date Added (Newest)" },
];

export default function ApplicationsTable(props: PropsInterface) {
  const { isAdmin = false, isTechgen = false } = props;
  const [title, setTitle] = useState<string>("");
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [colleges, setColleges] = useState<CollegeUnitType[]>([]);
  const [techgens, setTechgens] = useState<string[]>([]);
  const [ipTypes, setIpTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const { applications, isLoading, refetch } =
    useApplicationsGetApplicationsByQuery({
      title,
      statuses,
      colleges,
      techgens,
      ip_types: ipTypes,
    });
  const [sortedApplications, setSortedApplications] = useState(
    applications || [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);

  useEffect(() => {
    refetch();
  }, [title, statuses, colleges, techgens, ipTypes, refetch]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedApplications.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(sortedApplications.length / recordsPerPage);

  const tableHeaders = [
    "IP Title",
    "Project Title",
    "Type",
    "Filing Date",
    "Registration Date",
    "Funding Agency",
    "Technology Generators",
    "Colleges",
    "Status",
    "Actions",
  ];

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  function applyFilters(filters: {
    title: string;
    statuses: StatusType | StatusType[] | undefined;
    colleges: CollegeUnitType[];
    techgens: string[];
    ip_types: string[];
  }) {
    const statusArray = Array.isArray(filters.statuses)
      ? filters.statuses
      : [filters.statuses];

    setTitle(filters.title);
    setStatuses(filters.statuses ? (statusArray as StatusType[]) : []);
    setColleges(filters.colleges);
    setTechgens(filters.techgens);
    setIpTypes(filters.ip_types);
    // Reset to first page whenever filters are applied
    setCurrentPage(1);
    refetch(); // This is the core instruction to refresh data
  }

  function handleRemoveFilterTag(type: string, value: string) {
    if (type === "title") {
      setTitle("");
    } else if (type === "status") {
      setStatuses((prev) => prev.filter((s) => s !== value));
    } else if (type === "college") {
      setColleges((prev) => prev.filter((c) => c !== value));
    } else if (type === "techgen") {
      setTechgens((prev) => prev.filter((t) => t !== value));
    }
    // and refetch
    setCurrentPage(1);
    refetch();
  }

  function clearAllFilters() {
    setTitle("");
    setStatuses([]);
    setColleges([]);
    setTechgens([]);
    setIpTypes([]);
    // and refetch
    setCurrentPage(1);
    refetch();
  }

  function toggleFilterPanel() {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  }

  function handleSortChange(sortValue: string) {
    setSortBy(sortValue);
    setIsSortPanelOpen(false);

    const [field, order] = sortValue.split("-");
    const sorted = sortApplications(
      applications || [],
      field as keyof Application,
      order === "asc",
    );
    setSortedApplications(sorted);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      <div className="md::items-center mb-4 flex flex-col gap-2 md:flex-row md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isTechgen ? "Your Applications" : "Applications Registry"}
        </h1>
        <div className="flex flex-col gap-3 md:flex-row">
          <Button startIcon={<PlusIcon size={30} />}>
            Add New Application
          </Button>
          <div className="flex justify-start gap-2">
            <div className="flex gap-0">
              <Popover open={isSortPanelOpen} onOpenChange={setIsSortPanelOpen}>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    className="data-[empty=true]:text-muted-foreground m-0 flex-1 justify-start bg-blue-500 text-left"
                    data-empty={title === "" ? "true" : "false"}
                  >
                    {sortBy
                      ? sortOptions.find((option) => option.value === sortBy)
                          ?.label
                      : "Sort By"}

                    <ArrowUpDown size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="max-h-[300px] w-[calc(100vw-2rem)] overflow-y-auto p-2 sm:w-64"
                  align="start"
                  collisionPadding={16}
                >
                  <div className="flex flex-col gap-1">
                    <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold tracking-wider uppercase">
                      Sort Options
                    </div>

                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className="flex w-full items-center justify-start rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {sortBy && (
                <Button
                  onClick={() => {
                    setSortBy("");
                    setSortedApplications(applications || []);
                  }}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground h-auto w-auto shrink-0 p-0 hover:bg-transparent"
                >
                  <X size={20} />
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              startIcon={<FilterIcon size={18} />}
              onClick={toggleFilterPanel}
            >
              {isFilterPanelOpen ? "Close Filters" : "Filter"}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Panel and Active Filters*/}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onApplyFilters={applyFilters}
        onClose={() => setIsFilterPanelOpen(false)}
        currentFilters={{
          title,
          statuses,
          colleges,
          techgens,
          ip_types: ipTypes,
        }}
      />

      <ActiveFilters
        title={title}
        statuses={statuses}
        colleges={colleges}
        techgens={techgens}
        ip_types={ipTypes}
        onRemove={handleRemoveFilterTag}
        onClearAll={clearAllFilters}
      />

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex h-60 items-center justify-center py-5 text-gray-500">
            Fetching applications...{"  "}
            <Loader className="animate-spin text-gray-500" size={18} />
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
              {currentRecords?.length === 0 && (
                <TableRow>
                  <TableCell
                    className="text-theme-sm p-2 py-10 text-center text-gray-500"
                    colSpan={10}
                  >
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
              {currentRecords?.map((record) => {
                let statusColor = "warning";
                if (record.status_type === "registered") {
                  statusColor = "success";
                } else if (
                  record.status_type === "closed" ||
                  record.status_type === "downgraded_to_um"
                ) {
                  statusColor = "error";
                }
                return (
                  <TableRow key={record.id}>
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      <Link href={"/"} className="hover:text-brand-500">
                        {record.ip_title ?? "--"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      {record.project_title.trim().length === 0 ||
                      record.project_title === undefined
                        ? "--"
                        : record.project_title}
                    </TableCell>
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      {ipTypeToTitle(record.ip_type as IpType) || "--"}
                    </TableCell>
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      {record.filing_date
                        ? formatDate(record.filing_date)
                        : "--"}
                    </TableCell>
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      {record.registration_date
                        ? formatDate(record.registration_date)
                        : "--"}
                    </TableCell>
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      {record.funding_agency || "--"}
                    </TableCell>
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      {record.techgens?.join(", ") || "--"}
                    </TableCell>
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      {record.colleges?.join(", ") || "--"}
                    </TableCell>
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      <Badge
                        size="sm"
                        color={statusColor as BadgeProps["color"]}
                      >
                        {STATUS_LABELS[record.status_type as StatusType] ||
                          "Unknown Status"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-800">
                      {isAdmin ? (
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`${isAdmin ? "/admin" : "/techgen"}/view-application?applicationID=${record.id}`}
                            className="hover:text-brand-500"
                          >
                            <PencilIcon />
                          </Link>
                          <TrashBinIcon className="hover:text-error-500" />
                        </div>
                      ) : (
                        <EyeIcon className="hover:text-brand-500 m-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <hr className="border border-gray-100"></hr>
      )}

      {!isLoading && totalPages > 1 && (
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
      )}
    </div>
  );
}
