"use client";

import { useEffect, useState } from "react";
import { useGetUsers } from "@/hooks/users/useGetUsers";
import { useUpdateUserRole } from "@/hooks/users/useUpdateUserRole";
import useAddNewUserModal from "@/hooks/useAddNewUserModal";
import { filterUsers } from "@/lib/helper/filter-users";
import { generatePagination } from "@/lib/helper/generate-pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import Button from "../ui/button/Button";
import { ActiveFilters } from "./filter/ActiveFilters";
import { FilterPanel } from "./filter/FilterPanel";
import { FilterIcon, Loader, PlusIcon } from "lucide-react";
import { CollegeUnitType } from "@/lib/types/college-units";
import { RoleType } from "@/lib/types/role";
import { useConfirm } from "@/hooks/useConfirm";
import { toast } from "sonner";
import Select from "../form/Select";
import { ROLE_OPTIONS } from "@/lib/constants/roles";

type RequestStatusType = "approved" | "rejected" | "pending";

export default function UsersTable() {
  const { data: usersData, isLoading, isFetching } = useGetUsers();
  const { updateUserRole } = useUpdateUserRole();
  const [currentPage, setCurrentPage] = useState(1);
  const { openModal } = useAddNewUserModal();
  const confirm = useConfirm();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [nameEmail, setNameEmail] = useState<string>("");
  const [colleges, setColleges] = useState<CollegeUnitType[]>([]);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [filteredData, setFilteredData] = useState(usersData ?? []);
  const [updatingRoleUserId, setUpdatingRoleUserId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const filtered = filterUsers(usersData || [], {
      nameEmail,
      colleges,
      roles,
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [nameEmail, colleges, roles, usersData]);

  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  function handleClick() {
    openModal();
  }

  function applyFilters(filters: {
    nameEmail: string;
    statuses: RequestStatusType[] | RequestStatusType;
    colleges: CollegeUnitType[];
    roles: RoleType[];
  }) {
    setNameEmail(filters.nameEmail);
    setColleges(filters.colleges);
    setRoles(filters.roles);
    setCurrentPage(1);
  }

  function handleRemoveFilterTag(type: string, value: string) {
    if (type === "name_email") {
      setNameEmail("");
    } else if (type === "college") {
      setColleges((prev) => prev.filter((c) => c !== value));
    } else if (type === "role") {
      setRoles((prev) => prev.filter((r) => r !== value));
    }
    setCurrentPage(1);
  }

  function clearAllFilters() {
    setNameEmail("");
    setColleges([]);
    setRoles([]);
    setCurrentPage(1);
  }

  function toggleFilterPanel() {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  }

  async function handleRoleChange(
    user: NonNullable<typeof usersData>[number],
    role: RoleType,
  ) {
    if (role === user.role) return;

    const isConfirmed = await confirm({
      title: "Confirm Role Change",
      message: `Change ${user.full_name}'s role from ${user.role} to ${role}?`,
    });

    if (!isConfirmed) return;

    try {
      setUpdatingRoleUserId(user.id);
      await updateUserRole({ id: user.id, role });
      toast.success("Successfully updated the user's role.");
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "There was a problem updating the user's role.",
      );
    } finally {
      setUpdatingRoleUserId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>

          {!isLoading && isFetching && (
            <span className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Loader className="animate-spin text-gray-500" size={16} />
              Refreshing...
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
        <Button
          variant="outline"
          startIcon={<FilterIcon size={18} />}
          onClick={toggleFilterPanel}
          className="h-12 max-w-fit"
          disabled={isLoading}
        >
          {isFilterPanelOpen ? "Close Filters" : "Filter"}
        </Button>

        <Button
          onClick={handleClick}
          disabled={isLoading}
          startIcon={<PlusIcon size={20} />}
          size="sm"
          className="h-12"
        >
          Add New User
        </Button>
      </div>

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onApplyFilters={applyFilters}
        onClose={() => setIsFilterPanelOpen(false)}
        currentFilters={{
          nameEmail,
          statuses: [],
          colleges,
          roles,
        }}
      />

      <ActiveFilters
        name_email={nameEmail}
        colleges={colleges}
        roles={roles}
        onRemove={handleRemoveFilterTag}
        onClearAll={clearAllFilters}
      />

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex h-60 items-center justify-center gap-2 py-5 text-gray-500">
            <span>Fetching users...</span>
            <Loader className="animate-spin text-gray-500" size={18} />
          </div>
        ) : (
          <div className="relative">
            {!isLoading && isFetching && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden rounded-full bg-transparent">
                <div className="h-full w-full animate-pulse bg-gray-300" />
              </div>
            )}

            <Table>
              <TableHeader className="border-y border-gray-100">
                <TableRow>
                  {["Full Name", "Colleges", "Email", "Role"].map((header) => (
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
                      No users found.
                    </TableCell>
                  </TableRow>
                )}

                {currentRecords.map((record) => {
                  const isUpdatingRole = updatingRoleUserId === record.id;

                  return (
                    <TableRow key={record.id}>
                      <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                        <Link href={"/"} className="hover:text-brand-500">
                          {record.full_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                        {record.external_institution ??
                          record.college_code ??
                          record.other_college_name}
                      </TableCell>
                      <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                        {record.email}
                      </TableCell>
                      <TableCell className="text-theme-sm min-w-44 p-2 py-3 text-gray-800">
                        <Select
                          selectedValue={record.role}
                          defaultValue={record.role}
                          options={ROLE_OPTIONS}
                          disabled={isUpdatingRole || isFetching}
                          onChange={(value) =>
                            handleRoleChange(record, value as RoleType)
                          }
                          className="h-9 py-2"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <hr className="border border-gray-100" />

      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading || isFetching}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {generatePagination(currentPage, totalPages).map((page, i) =>
            page === "..." ? (
              <span
                key={`ellipsis-${i}-${page}`}
                className="flex h-8 w-8 items-center justify-center text-sm text-gray-500"
              >
                ...
              </span>
            ) : (
              <Button
                key={`page-${i}-${page}`}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page as number)}
                disabled={isLoading || isFetching}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading || isFetching}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
