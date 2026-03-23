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
import Badge, { BadgeProps } from "../ui/badge/Badge";
import Link from "next/link";
import Button from "../ui/button/Button";
import { FilterPanel } from "./application-table/FilterPanel";
import { ActiveFilters } from "./application-table/ActiveFilters";
import {
  FilterIcon,
  Loader,
  X,
  EyeIcon,
  PlusIcon,
  Archive,
  ArchiveRestore,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from "lucide-react";
import { sortApplications } from "@/lib/helper/sort-applications";
import { cn } from "@/lib/utils";
import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { toast } from "sonner";
import { buttonVariants } from "../ui/button";
import Hint from "./Tooltip";
import { useRouter } from "next/navigation";
import { SearchApplication } from "@/lib/types/application";

interface PropsInterface {
  isAdmin?: boolean;
  isTechgen?: boolean;
}

const sortOptions = [
  { value: "ip_title", label: "IP Title (A-Z)" },
  { value: "filing_date", label: "Filing Date " },
  { value: "registration_date", label: "Registration Date" },
  { value: "created_at", label: "Date Added" },
  { value: "updated_at", label: "Updated Date" },
];

export default function ApplicationsTable(props: PropsInterface) {
  const { isAdmin = false, isTechgen = false } = props;
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [colleges, setColleges] = useState<CollegeUnitType[]>([]);
  const [techgens, setTechgens] = useState<string[]>([]);
  const [ipTypes, setIpTypes] = useState<string[]>([]);
  const [isAscendingSort, setIsAscendingSort] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("updated_at");
  const { applications, isLoading, refetch } =
    useApplicationsGetApplicationsByQuery({
      title,
      statuses,
      colleges,
      techgens,
      ip_types: ipTypes,
    });

  const { isLoading: isUpdating, updateApp } = useUpdateApplication({
    appId: "",
  });
  const [sortedApplications, setSortedApplications] = useState<
    SearchApplication[]
  >(applications || []);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);

  useEffect(() => {
    refetch();
  }, [title, statuses, colleges, techgens, ipTypes, refetch]);

  useEffect(() => {
    if (!applications) return;
    handleSortChange(sortBy, isAscendingSort); // re-apply sorting whenever applications data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications]);

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
    // reset to first page whenever filters are applied
    setCurrentPage(1);
    refetch(); // refetch with new filters
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
    } else if (type === "ip_type") {
      setIpTypes((prev) => prev.filter((i) => i !== value));
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

  function handleSortChange(sortValue: string, order: boolean) {
    setSortBy(sortValue);
    setIsSortPanelOpen(false);

    const sorted = sortApplications(
      applications || [],
      sortValue as keyof SearchApplication,
      order,
    );
    setSortedApplications(sorted);
  }

  async function toggleArchiveStatus(
    applicationId: string,
    isCurrentlyArchived: boolean,
  ) {
    toast.promise(
      updateApp({
        id: applicationId,
        applicationData: {
          is_archived: !isCurrentlyArchived,
        },
      }),
      {
        loading: "Archiving application...",
        success: () => {
          refetch();
          return isCurrentlyArchived
            ? "Application unarchived."
            : "Application archived.";
        },
        error: "Failed to archive application.",
      },
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      <div className="md::items-center mb-4 flex flex-col gap-2 md:flex-row md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isTechgen ? "Your Applications" : "Applications Registry"}
        </h1>
        <div className="flex flex-col gap-3 md:flex-row">
          {(isAdmin || isTechgen) && (
            <Button
              startIcon={<PlusIcon size={30} />}
              onClick={() => {
                router.push(
                  isAdmin
                    ? "/admin/new-application"
                    : "/techgen/new-application",
                );
              }}
            >
              Add New Application
            </Button>
          )}

          <div className="xsm:flex-row flex flex-col justify-start gap-2">
            {/* Sort Panel */}
            <div className="flex gap-0">
              <Popover open={isSortPanelOpen} onOpenChange={setIsSortPanelOpen}>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "data-[empty=true]:text-muted-foreground m-0 flex h-auto w-fit justify-start px-3 py-3 text-left text-sm font-medium text-gray-700",
                  )}
                >
                  {sortBy
                    ? sortOptions.find((option) => option.value === sortBy)
                        ?.label
                    : "Sort By"}
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
                        onClick={() =>
                          handleSortChange(option.value, isAscendingSort)
                        }
                        className="flex w-full items-center justify-start rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {sortBy && (
                <>
                  <button
                    onClick={() => {
                      const order = !isAscendingSort;
                      setIsAscendingSort(order);
                      handleSortChange(sortBy, order);
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "text-muted-foreground hover:text-foreground flex h-auto w-auto shrink-0 items-center justify-center p-0 hover:bg-transparent",
                    )}
                  >
                    {isAscendingSort ? (
                      <ArrowDownNarrowWide className="h-6! w-6!" />
                    ) : (
                      <ArrowUpNarrowWide className="h-6! w-6!" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("");
                      setSortedApplications(applications || []);
                      setIsAscendingSort(true);
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "text-muted-foreground hover:text-foreground h-auto w-auto shrink-0 p-0 hover:bg-transparent",
                    )}
                  >
                    <X className="h-6! w-6!" />
                  </button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              startIcon={<FilterIcon size={18} />}
              onClick={toggleFilterPanel}
              className="max-w-fit"
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
                  <TableRow
                    key={record.id}
                    className={cn(
                      record.is_archived && "text-muted-foreground bg-gray-100",
                    )}
                  >
                    <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                      <div className="flex flex-row items-center gap-1">
                        <Link href={"/"} className="hover:text-brand-500">
                          {record.ip_title ?? "--"}
                        </Link>
                      </div>
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
                      <div className="flex flex-col gap-3">
                        {" "}
                        {/* Adds space between each person */}
                        {record?.grouped_techgen_college?.map((item) => (
                          <div
                            key={item.full_name}
                            className="flex flex-col leading-tight"
                          >
                            {/* Name is darker and medium weight */}
                            <span className="font-medium text-gray-900">
                              {item.full_name}
                            </span>
                            {/* College is smaller and lighter */}
                            <span className="text-xs text-gray-500">
                              {item.college}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-theme-sm gap-2 p-2 py-3 text-gray-800">
                      <div className="flex flex-col gap-2">
                        <Badge
                          size="sm"
                          color={statusColor as BadgeProps["color"]}
                          className="max-w-fit truncate"
                        >
                          {STATUS_LABELS[record.status_type as StatusType] ||
                            "Unknown Status"}
                        </Badge>
                        {record.is_withdrawn && (
                          <Badge size="sm" color="error" className="max-w-fit">
                            Withdrawn
                          </Badge>
                        )}
                        {record.is_archived && (
                          <Badge color="dark" size="sm" className="max-w-fit">
                            Archived
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-800">
                      {(isAdmin || isTechgen) && (
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`${isAdmin ? "/admin" : "/techgen"}/view-application?applicationID=${record.id}`}
                            className="hover:text-brand-500"
                            aria-label={`View ${record.project_title}`}
                          >
                            <Hint label="View application">
                              <EyeIcon size={18} />
                            </Hint>
                          </Link>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              onClick={() =>
                                toggleArchiveStatus(
                                  record.id,
                                  record.is_archived,
                                )
                              }
                              className={cn(
                                "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                              )}
                              disabled={isUpdating}
                              aria-label={
                                record.is_archived
                                  ? `Unarchive ${record.project_title}`
                                  : `Archive ${record.project_title}`
                              }
                            >
                              <Hint
                                label={
                                  record.is_archived
                                    ? "Unarchive Application"
                                    : "Archive Application"
                                }
                              >
                                {record.is_archived ? (
                                  <ArchiveRestore
                                    size={18}
                                    className="hover:text-success-500"
                                  />
                                ) : (
                                  <Archive
                                    size={18}
                                    className="hover:text-error-500"
                                  />
                                )}
                              </Hint>
                            </Button>
                          )}
                        </div>
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
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i.toString() + "-page-button"}
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
