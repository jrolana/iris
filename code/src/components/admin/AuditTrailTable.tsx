"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import FilterButton from "../common/FilterButton";
import { dummyAuditTrail } from "@/lib/dummy-data/audit_trail";
import { AuditLogType } from "@/lib/types/audit_trail";
import { StatusBadge } from "../common/StatusBadge";
import {
  ActionCategoryBadgeClasses,
  ActionResultBadgeClasses,
} from "@/lib/constants/ui";

export default function AuditTrailTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = dummyAuditTrail.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(dummyAuditTrail.length / recordsPerPage);

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

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Audit Trail</h1>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <FilterButton />
        </div>
      </div>

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
