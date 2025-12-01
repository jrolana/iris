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
import SearchInput from "../common/SearchInput";
import { PencilIcon, TrashBinIcon } from "@/icons/index";
import FilterButton from "../common/FilterButton";

interface IPRecord {
  id: number;
  ipTitle: string;
  projectTitle: string;
  type: string;
  filingDate: Date;
  registrationDate: Date;
  fundingAgency: string;
  techGens: string[];
  colleges: string[];
  status: "pending" | "filed";
}

const tableData: IPRecord[] = [
  {
    id: 1,
    ipTitle: "Smart Irrigation Control System",
    projectTitle: "IoT-Based Precision Agriculture",
    type: "Utility Model",
    filingDate: new Date("2023-04-15"),
    registrationDate: new Date("2024-01-10"),
    fundingAgency: "Department of Science and Technology",
    techGens: ["Juan Dela Cruz", "Maria Santos", "Jose Ramirez"],
    colleges: ["CAS"],
    status: "pending",
  },
  {
    id: 2,
    ipTitle: "AI-Driven Crop Disease Detection",
    projectTitle: "Machine Vision for Farm Diagnostics",
    type: "Patent",
    filingDate: new Date("2022-08-12"),
    registrationDate: new Date("2023-05-30"),
    fundingAgency: "USAID",
    techGens: ["Anna Lee", "Carlos Mendoza", "Patrick Reyes"],
    colleges: ["CM", "CAS"],
    status: "filed",
  },
  {
    id: 3,
    ipTitle: "Solar-Powered Water Desalination Unit",
    projectTitle: "Sustainable Water Systems",
    type: "Utility Model",
    filingDate: new Date("2021-11-05"),
    registrationDate: new Date("2022-09-18"),
    fundingAgency: "CHED",
    techGens: ["Lorenzo Cruz", "Michelle Tan"],
    colleges: ["CFOS"],
    status: "filed",
  },
  {
    id: 4,
    ipTitle: "Portable Environmental Monitoring Device",
    projectTitle: "Low-Cost Air Quality Assessment",
    type: "Industrial Design",
    filingDate: new Date("2023-02-20"),
    registrationDate: new Date("2023-12-01"),
    fundingAgency: "DENR",
    techGens: ["Rafael Torres", "Bianca Garcia", "Henry Lopez"],
    colleges: ["SOTECH"],
    status: "pending",
  },
  {
    id: 5,
    ipTitle: "Learning Analytics Dashboard",
    projectTitle: "Adaptive Education Technologies",
    type: "Copyright",
    filingDate: new Date("2022-06-14"),
    registrationDate: new Date("2022-10-22"),
    fundingAgency: "ADB",
    techGens: ["Samantha Rivera", "Daniel Cruz"],
    colleges: ["CAS", "SOTECH"],
    status: "filed",
  },
  {
    id: 6,
    ipTitle: "Autonomous Greenhouse Climate Controller",
    projectTitle: "Smart Agriculture Environment Management",
    type: "Patent",
    filingDate: new Date("2024-02-01"),
    registrationDate: new Date("2025-03-15"),
    fundingAgency: "Department of Agriculture",
    techGens: ["Miguel Santos", "Elena Rivera", "David Lopez"],
    colleges: ["CAS", "CFOS"],
    status: "filed",
  },
  {
    id: 7,
    ipTitle: "Drone-Assisted Pest Surveillance System",
    projectTitle: "AI-Enabled Crop Monitoring",
    type: "Utility Model",
    filingDate: new Date("2023-07-18"),
    registrationDate: new Date("2024-02-20"),
    fundingAgency: "DA-PhilFUND",
    techGens: ["Isabel Cruz", "Ramon Morales", "Jessica Tan"],
    colleges: ["CM", "SOTECH"],
    status: "pending",
  },
  {
    id: 8,
    ipTitle: "Wind-Powered Irrigation Pump",
    projectTitle: "Renewable Energy for Agriculture",
    type: "Industrial Design",
    filingDate: new Date("2022-03-12"),
    registrationDate: new Date("2023-01-25"),
    fundingAgency: "DOE",
    techGens: ["Paolo Garcia", "Anna Mendoza"],
    colleges: ["CFOS", "CAS"],
    status: "filed",
  },
  {
    id: 9,
    ipTitle: "Wearable Soil Nutrient Sensor",
    projectTitle: "Precision Soil Analytics",
    type: "Patent",
    filingDate: new Date("2023-05-10"),
    registrationDate: new Date("2024-04-08"),
    fundingAgency: "DA-RD",
    techGens: ["Lucia Torres", "Martin Reyes", "Clara Fernandez"],
    colleges: ["SOTECH", "CAS"],
    status: "filed",
  },
  {
    id: 10,
    ipTitle: "AI-Based Student Performance Predictor",
    projectTitle: "Next-Gen Learning Analytics",
    type: "Utility Model",
    filingDate: new Date("2023-01-20"),
    registrationDate: new Date("2023-09-30"),
    fundingAgency: "CHED",
    techGens: ["Emilia Cruz", "Victor Tan"],
    colleges: ["CAS", "SOTECH"],
    status: "pending",
  },
];

export default function ApplicationsTable() {
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
          Applications Registry
        </h1>
        <div className="flex items-center gap-3">
          <SearchInput />
          <FilterButton />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100">
            <TableRow>
              {[
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
                    {record.ipTitle}
                  </Link>
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.projectTitle}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.type}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.filingDate.toDateString()}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.registrationDate.toDateString()}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.fundingAgency}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.techGens.join(", ")}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  {record.colleges.join(", ")}
                </TableCell>
                <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                  <Badge
                    size="sm"
                    color={
                      record.status === "filed"
                        ? "success"
                        : record.status === "pending"
                          ? "warning"
                          : "error"
                    }
                  >
                    {record.status}
                  </Badge>
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
