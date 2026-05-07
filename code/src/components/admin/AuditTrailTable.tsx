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
import { AuditLogType, mapAuditTrailRow } from "@/lib/types/audit_trail";
import { StatusBadge } from "../common/StatusBadge";
import {
  ActionCategoryBadgeClasses,
  ActionResultBadgeClasses,
} from "@/lib/constants/ui";
import { useGetAuditTrail } from "@/hooks/audit-trail/useGetAuditTrail";
import { Loader } from "lucide-react";

export default function AuditTrailTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const { data, isLoading, isFetching } = useGetAuditTrail();
  const records = data.map(mapAuditTrailRow);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.max(1, Math.ceil(records.length / recordsPerPage));

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
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Audit Trail</h1>
          {isFetching && !isLoading ? (
            <p className="mt-1 text-sm text-slate-500">Refreshing audit entries...</p>
          ) : null}
        </div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <FilterButton />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
            <Loader className="h-4 w-4 animate-spin" />
            Loading audit trail...
          </div>
        ) : currentRecords.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
            No audit entries yet.
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
                    <div className="space-y-1">
                      <p>{record.actionTaken}</p>
                      {record.changedFields ? (
                        <pre className="max-w-xs overflow-x-auto rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500">
                          {JSON.stringify(record.changedFields, null, 2)}
                        </pre>
                      ) : null}
                    </div>
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
