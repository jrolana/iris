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
];

export default function ApplicationsTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Your Applications
          </h1>
        </div>

        <Button> Submit New Application</Button>
      </div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            startIcon={
              <svg
                className="fill-white stroke-current dark:fill-gray-800"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.29004 5.90393H17.7067"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.7075 14.0961H2.29085"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
                <path
                  d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
              </svg>
            }
          >
            Filter
          </Button>
          <Button variant="outline" size="sm">
            See all
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table className="border-separate border-spacing-2">
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-700"
              >
                IP Title
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-700"
              >
                Project Title
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-700"
              >
                Type
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-700"
              >
                Filling Date
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-700"
              >
                Registration Date
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-700"
              >
                Funding Agency
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-700"
              >
                Technology Generators
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-700"
              >
                Colleges
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-700"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((record) => (
              <TableRow key={record.id} className="">
                <TableCell className="text-theme-sm py-3 text-gray-500">
                  <Link href={"/"} className="cursor hover:text-brand-500">
                    {record.ipTitle}
                  </Link>
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500">
                  {record.projectTitle}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500">
                  {record.type}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500">
                  {record.filingDate.toDateString()}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500">
                  {record.registrationDate.toDateString()}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500">
                  {record.fundingAgency}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500">
                  {record.techGens.join(" ")}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500">
                  {record.colleges.join(" ")}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
