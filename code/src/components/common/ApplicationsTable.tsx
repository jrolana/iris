"use client";

import { useState } from "react";
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
import { PencilIcon, TrashBinIcon } from "@/icons/index";
import FilterButton from "./FilterButton";
import { dummyApplications } from "@/lib/dummy-data/application";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { PlusIcon, EyeIcon } from "@/icons/index";

interface propsInterface {
  isAdmin?: boolean;
  isTechgen?: boolean;
}

export default function ApplicationsTable(props: propsInterface) {
  const { isAdmin = false, isTechgen = false } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = dummyApplications.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(dummyApplications.length / recordsPerPage);

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
            <SearchInput />
            <FilterButton />
          </div>
        </>
      ) : (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Applications Registry
          </h1>
          <div className="flex items-center gap-3">
            <SearchInput />
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
              <TableRow key={record.applicationId}>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  <Link href={"/"} className="hover:text-brand-500">
                    {record.ipTitle}
                  </Link>
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.projectTitle}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {ipTypeToTitle(record.ipType)}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {typeof record.filingDate == "string"
                    ? record.filingDate
                    : record.filingDate?.toDateString()}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.registrationDate?.toDateString()}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.fundingAgency}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.techGens?.join(", ")}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.colleges?.join(", ")}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  <Badge
                    size="sm"
                    color={
                      record.currentStatus === "registered"
                        ? "success"
                        : record.currentStatus === "closed" ||
                            record.currentStatus === "downgraded_to_um"
                          ? "error"
                          : "warning"
                    }
                  >
                    {record.currentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-800">
                  {isAdmin ? (
                    <div className="flex items-center gap-2">
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
