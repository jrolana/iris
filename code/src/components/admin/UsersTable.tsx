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
import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";
import FilterButton from "../common/FilterButton";

interface User {
  id: number;
  fullName: string;
  college: string;
  email: string;
  role: "admin" | "techgen" | "up-official";
}

const tableData: User[] = [
  {
    id: 1,
    fullName: "Elena Cruz",
    college: "CAS",
    email: "elena.cruz@up.edu.ph",
    role: "admin",
  },
  {
    id: 2,
    fullName: "Mark Reyes",
    college: "CM",
    email: "mark.reyes@up.edu.ph",
    role: "techgen",
  },
  {
    id: 3,
    fullName: "Sophia Santos",
    college: "CFOS",
    email: "sophia.santos@up.edu.ph",
    role: "up-official",
  },
  {
    id: 4,
    fullName: "Luis Navarro",
    college: "SOTECH",
    email: "luis.navarro@up.edu.ph",
    role: "techgen",
  },
  {
    id: 5,
    fullName: "Clara Mendoza",
    college: "CAS",
    email: "clara.mendoza@up.edu.ph",
    role: "admin",
  },
  {
    id: 6,
    fullName: "Daniel Garcia",
    college: "CM",
    email: "daniel.garcia@up.edu.ph",
    role: "up-official",
  },
  {
    id: 7,
    fullName: "Isabel Ramos",
    college: "CFOS",
    email: "isabel.ramos@up.edu.ph",
    role: "techgen",
  },
  {
    id: 8,
    fullName: "Victor Lim",
    college: "SOTECH",
    email: "victor.lim@up.edu.ph",
    role: "admin",
  },
  {
    id: 9,
    fullName: "Angela Torres",
    college: "CAS",
    email: "angela.torres@up.edu.ph",
    role: "techgen",
  },
  {
    id: 10,
    fullName: "Josefina Cruz",
    college: "CM",
    email: "josefina.cruz@up.edu.ph",
    role: "up-official",
  },
];

export default function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = tableData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(tableData.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>
        <Button startIcon={<PlusIcon size={30} />}> Add New User</Button>
      </div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput />
        <FilterButton />
      </div>

      <div className="overflow-x-auto">
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
            {currentRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  <Link href={"/"} className="hover:text-brand-500">
                    {record.fullName}
                  </Link>
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.college}
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
