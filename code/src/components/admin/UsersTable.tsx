"use client";

import { useEffect, useState } from "react";
import { useGetUsers } from "@/hooks/users/useGetUsers";
import useAddNewUserModal from "@/hooks/useAddNewUserModal";
import { filterUsers } from "@/lib/helper/filter-users";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import Button from "../ui/button/Button";
import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";
import { ActiveFilters } from "./filter/ActiveFilters";
import { FilterPanel } from "./filter/FilterPanel";
import { FilterIcon, Loader } from "lucide-react";
import { CollegeUnitType } from "@/lib/types/college-units";
import { RoleType } from "@/lib/types/role";

type RequestStatusType = "approved" | "rejected" | "pending";

export default function UsersTable() {
  const { data: usersData, isLoading } = useGetUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const { openModal } = useAddNewUserModal();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [nameEmail, setNameEmail] = useState<string>("");
  const [colleges, setColleges] = useState<CollegeUnitType[]>([]);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [filteredData, setFilteredData] = useState(usersData ?? []);

  useEffect(() => {
    // Whenever filters change, reset to first page and apply filters to data
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
    // reset to first page whenever filters are applied
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

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>
      </div>
      <div className="mb-4 flex flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
        <Button
          variant="outline"
          startIcon={<FilterIcon size={18} />}
          onClick={toggleFilterPanel}
          className="max-w-fit"
          disabled={isLoading}
        >
          {isFilterPanelOpen ? "Close Filters" : "Filter"}
        </Button>
        <Button
          onClick={handleClick}
          disabled={isLoading}
          startIcon={<PlusIcon size={30} />}
          size="sm"
        >
          Add New User
        </Button>
      </div>

      {/* Filter Panel and Active Filters*/}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onApplyFilters={applyFilters}
        onClose={() => setIsFilterPanelOpen(false)}
        currentFilters={{
          nameEmail: nameEmail,
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
          <div className="flex h-60 items-center justify-center py-5 text-gray-500">
            Fetching users...{"  "}
            <Loader className="animate-spin text-gray-500" size={18} />
          </div>
        ) : (
          <Table>
            <TableHeader className="border-y border-gray-100">
              <TableRow>
                {["Full Name", "Colleges", "Email", "Role", "Actions"].map(
                  (header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className="text-theme-xs p-2 py-3 text-start font-medium text-gray-500"
                    >
                      {header}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {currentRecords?.length === 0 && (
                <TableRow>
                  <TableCell
                    className="text-theme-sm p-2 py-10 text-center text-gray-500"
                    colSpan={10}
                  >
                    No Users found.
                  </TableCell>
                </TableRow>
              )}
              {currentRecords.map((record) => (
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
                  <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                    {record.role}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-800">
                    <div className="flex items-center gap-2">
                      <Link href="/" className="hover:text-brand-500">
                        <PencilIcon />
                      </Link>
                      <TrashBinIcon className="hover:text-error-500" />
                    </div>
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
