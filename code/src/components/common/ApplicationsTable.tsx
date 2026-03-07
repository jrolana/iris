"use client";

import { useState } from "react";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { useApplicationsGetApplicationsByQuery } from "@/hooks/applications/useGetApplicationsByQuery";
import { formatDate } from "@/lib/helper/format-date";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import Button from "../ui/button/Button";
import SearchInput from "./SearchInput";
import { PencilIcon, TrashBinIcon, PlusIcon, EyeIcon } from "@/icons/index";
import FilterButton from "./FilterButton";
import { IpType, StatusType } from "@/lib/types/ip";

interface PropsInterface {
  isAdmin?: boolean;
  isTechgen?: boolean;
}

export default function ApplicationsTable(props: PropsInterface) {
  const { isAdmin = false, isTechgen = false } = props;
  const { applications, isLoading, refetch } =
    useApplicationsGetApplicationsByQuery({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!applications || applications.length === 0) {
    return <div>No applications found.</div>;
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = applications.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(applications.length / recordsPerPage);

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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      {isTechgen ? (
        <>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              Your Applications
            </h1>
            <Button startIcon={<PlusIcon size={30} />}>
              Add New Application
            </Button>
          </div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput onChange={() => {}} />
            <FilterButton />
          </div>
        </>
      ) : (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Applications Registry
          </h1>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* TODO: implement search here */}
            <SearchInput
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e.target.value);
              }}
            />
            <FilterButton />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
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
            {currentRecords.map((record) => (
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
                  {record.filing_date ? formatDate(record.filing_date) : "--"}
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
                    color={
                      record.status_type === "registered"
                        ? "success"
                        : record.status_type === "closed" ||
                            record.status_type === "downgraded_to_um"
                          ? "error"
                          : "warning"
                    }
                  >
                    {STATUS_LABELS[record.status_type as StatusType] ||
                      "Unknown Status"}
                  </Badge>
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-800">
                  {isAdmin ? (
                    <div className="flex items-center justify-center gap-2">
                      <Link href="/" className="hover:text-brand-500">
                        <PencilIcon />
                      </Link>
                      <TrashBinIcon className="hover:text-error-500" />
                    </div>
                  ) : (
                    <EyeIcon className="hover:text-brand-500 m-auto" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
