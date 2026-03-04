"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import Button from "../ui/button/Button";
import SearchInput from "../common/SearchInput";
import FilterButton from "../common/FilterButton";
import { useGetRegistrationRequests } from "@/hooks/registration-request/useGetRegistrationRequests";
import Badge from "../ui/badge/Badge";
import { RegistrationRequestType } from "@/lib/types/users";
import { toast } from "sonner";
import { useUpdateRegistrationRequest } from "@/hooks/registration-request/useUpdateRegistrationRequest";
import { inviteUser } from "@/app/actions/invite-user";
import { toSupabaseDateTime } from "@/lib/helper/format-date";

export default function RegistrationRequestsTable() {
  const { registrationRequests: usersData, isLoading } =
    useGetRegistrationRequests();
  const {
    updateRegistrationRequest,
    isLoading: isUpdatingRegistrationRequest,
  } = useUpdateRegistrationRequest();

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!usersData) {
    return <div>No data yet.</div>;
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = usersData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(usersData.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  async function handleApprove(userData: RegistrationRequestType["Row"]) {
    try {
      await inviteUser({
        email: userData.email,
        userData,
      });
      toast.success("Successfully approved the registration request.");

      await updateRegistrationRequest({
        id: userData.id,
        userData: {
          status: "approved",
          invite_expires_at: toSupabaseDateTime(
            new Date(Date.now() + 24 * 60 * 60 * 1000),
          ),
        },
      });
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "There was a problem in approving the registration request.",
      );
    }
  }

  async function handleReject(userData: RegistrationRequestType["Row"]) {
    try {
      await updateRegistrationRequest(
        {
          id: userData.id,
          userData: {
            status: "rejected",
            invite_expires_at: null,
          },
        },
        {
          onSuccess: () => {
            toast.success("Successfully rejected the registration request.");
          },
          onError: () => {
            toast.error(
              "There was a problem rejecting the registration request.",
            );
          },
        },
      );
    } catch (e) {
      console.error(
        e instanceof Error
          ? e.message
          : "There was a problem in rejecting the registration request.",
      );
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Registration Requests
        </h1>
      </div>
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="self-start sm:w-1/3">{/* <SearchInput /> */}</div>
        <FilterButton />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100">
            <TableRow>
              {[
                "Full Name",
                "Email",
                "College",
                "Role",
                "Status",
                "Actions",
              ].map((header) => (
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
                    {record.full_name}
                  </Link>
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.email}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.college_code ??
                    record.other_college_name ??
                    record.external_institution}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.role}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  <Badge
                    color={
                      record.status == "pending"
                        ? "warning"
                        : record.status == "approved"
                          ? "success"
                          : "error"
                    }
                  >
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      disabled={
                        record.status != "pending" ||
                        isUpdatingRegistrationRequest
                      }
                      onClick={() => {
                        handleApprove(record);
                      }}
                      className="h-8"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={
                        record.status != "pending" ||
                        isUpdatingRegistrationRequest
                      }
                      onClick={() => {
                        handleReject(record);
                      }}
                      className="h-8"
                    >
                      Reject
                    </Button>
                  </div>
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
